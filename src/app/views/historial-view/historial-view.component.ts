import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ReunionService } from '../../services/reunion.service';
import { jwtDecode } from 'jwt-decode';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Proyecto } from '../../models/proyecto.model';
import { map, Observable, startWith } from 'rxjs';
import { ProyectoService } from '../../services/proyecto.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CancelarReunionModalComponent } from '../../components/cancelar-reunion-modal/cancelar-reunion-modal.component';

@Component({
  selector: 'app-historial-view',
  imports: [
    MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule,
    MatDatepickerModule, MatAutocompleteModule, AsyncPipe, MatPaginatorModule, MatTooltipModule,
    RouterLink, MatDialogModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './historial-view.component.html',
  styleUrl: './historial-view.component.css'
})
export class HistorialViewComponent implements AfterViewInit {

  constructor(
    private reunionService: ReunionService,
    private proyectoService: ProyectoService,
    private toastService: HotToastService
  ){}

  readonly dialogCancelar = inject(MatDialog)

  reuniones: any = [];

  estados:any = {
    Iniciado: 'bg-yellow-500',
    Finalizado: 'bg-blue-500',
    Cancelado: 'bg-red-500'
  }

  formFiltro = new FormGroup({
    proyecto: new FormControl<number|null>(null),
    inicio: new FormControl<Date|null>(null),
    fin: new FormControl<Date|null>(null)
  })

  proyectos: Proyecto[] = [];
  proyectosFiltrados!: Observable<Proyecto[]>;

  // Paginación
  currentPage = 0;
  totalRecords = 0;
  pageSize = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator

  claseEstado (estado: string): string {

    return `${ this.estados[estado] }`
  }

  ngAfterViewInit(): void {

    this.obtenerProyectos()
    this.configurarAutocomplete();
    const token = localStorage.getItem('token');
    if(token){
      const decoded:any = jwtDecode(token);

      this.paginator.page.subscribe((event: PageEvent)=>{
        this.onPageEvent(decoded, event)
      })

      if(decoded.id_rol && decoded.id){
        this.obtenerReuniones(decoded.id_rol, decoded.id)
      }

    }
  }

  onPageEvent(decoded:any, event: PageEvent):void {
    this.totalRecords = event.length;
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    if(decoded.id_rol && decoded.id){
      this.obtenerReuniones(decoded.id_rol, decoded.id)
    }

  }

  obtenerReuniones(id_rol: number, id_usuario: number): void {

    const page = this.currentPage + 1;
    const proyecto = this.formFiltro.controls['proyecto'].value;
    const inicio = this.formFiltro.controls['inicio'].value;
    const fin = this.formFiltro.controls['fin'].value

    if(id_rol != 1){

      this.reunionService.obtenerReuniones(null,this.pageSize, null, proyecto, id_usuario, page, inicio, fin).subscribe({
        next: response => {
          this.reuniones = response.data
          this.totalRecords = response.totalRecords
          console.log(response.data)
        },
        error: err => console.log(err)
      })

    }else{

      this.reunionService.obtenerReuniones(null,this.pageSize, null, proyecto, null, page, inicio, fin).subscribe({
        next: response => {
          this.reuniones = response.data
          this.totalRecords = response.totalRecords
          console.log(response.data)
        },
        error: err => console.log(err)
      })

    }

  }

  obtenerProyectos(): void {

    this.proyectoService.obtenerProyectos(1, null, 1).subscribe({
      next: (response) => {
        this.proyectos = response.data;
        this.configurarAutocomplete();
      },
      error: (err) => {
        console.error('El error: ', err);
      }
    })

  }

  displayProyectoNombre(proyecto: any): string {
    return proyecto && proyecto.nombre ? proyecto.nombre : '';
  }

  private _filterNombres(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.proyectos.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  configurarAutocomplete(): void {
    this.proyectosFiltrados = this.formFiltro.controls['proyecto'].valueChanges.pipe(
      startWith(''),
      map(value => {
        // Si el valor es un string (búsqueda), filtrar
        if (typeof value === 'string') {
          return value ? this._filterNombres(value) : this.proyectos.slice();
        }
        // Si el valor es un objeto (selección), mostrar todos
        return this.proyectos.slice();
      })
    );
  }

  onSubmit(): void {

    if(this.formFiltro.controls['inicio'].value && !this.formFiltro.controls['fin'].value){

      this.toastService.error("Ingrese un inicio y un fin, en caso de ser un solo día, seleccione el mismo día dos veces.", {
        position: 'top-right',
        duration: 5000
      })
      return
    }

    if(this.formFiltro.controls['proyecto'].value){
      const proyecto: any = this.formFiltro.controls['proyecto'].value
      this.formFiltro.controls['proyecto'].setValue(proyecto.id)

    }

    const proyecto = this.formFiltro.controls['proyecto'].value;
    const inicio = this.formFiltro.controls['inicio'].value;
    const fin = this.formFiltro.controls['fin'].value

    const token = localStorage.getItem('token');
    if(token){
      const decoded:any = jwtDecode(token);
      const page = this.currentPage +1;      

      if(decoded.id === 1){

        this.reunionService.obtenerReuniones(null, this.pageSize, null, proyecto, null, page, inicio, fin).subscribe({
          next: res => {
            this.reuniones = res.data
            this.totalRecords = res.totalRecords
          },
          error: err => {
            console.error(err)
          }
        })

      }else {

        this.reunionService.obtenerReuniones(null, 10, this.pageSize, proyecto, decoded.id, page, inicio, fin).subscribe({
          next: res => {
            this.reuniones = res.data
            this.totalRecords = res.totalRecords
          },
          error: err => {
            console.error(err)
          }
        })

      }

      console.log(this.formFiltro.value)
    }

  }

  mostrarModalCancelar(reunion: any): void {

    const dialogRef = this.dialogCancelar.open(CancelarReunionModalComponent, {
      data: reunion
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){

        const token = localStorage.getItem('token')
        if(token){
          const decoded:any = jwtDecode(token);

          if(decoded.id_rol && decoded.id){
            this.obtenerReuniones(decoded.id_rol, decoded.id)
          }

        }

      }
    })

  }

}
