import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ReunionService } from '../../../../services/reunion.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import { Proyecto } from '../../../../models/proyecto.model';
import { ProyectoService } from '../../../../services/proyecto.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-reuniones-realizadas',
  imports: [
    MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, ReactiveFormsModule, AsyncPipe, MatAutocompleteModule, MatSelectModule
  ],
  templateUrl: './reuniones-realizadas.component.html',
  styleUrl: './reuniones-realizadas.component.css'
})
export class ReunionesRealizadasComponent implements OnInit, AfterViewInit {

  constructor(
    private reunionService: ReunionService,
    private proyectoService:ProyectoService
  ){}

  proyectos: any[] = [];
  proyectosFiltrados!: Observable<Proyecto[]>;
  displayedColumns: string[] = ['proyecto', 'version','cantidad_reuniones'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator

  filtroForm = new FormGroup({
    id_proyecto: new FormControl<any>(null),
    requerimiento: new FormControl<string|null>(null),
    estado: new FormControl<number|null>(null),
  })

  ngOnInit(): void {
    this.obtenerDatos()
    this.obtenerProyectos();
    this.configurarAutocomplete();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  onSubmit(): void {
    const proyecto: any = this.filtroForm.controls['id_proyecto']?.value?.id;
    const requerimiento = this.filtroForm.controls['requerimiento'].value;
    const estado = this.filtroForm.controls['estado'].value;

    
    this.obtenerDatos(proyecto, estado, requerimiento)
  }

  obtenerDatos(id_proyecto?:number|null, id_estado?:number|null, requerimiento?:string|null): void {

    let proyecto = null;
    let estado = null;
    if(id_proyecto) proyecto = id_proyecto
    if(id_estado) estado = id_estado

    this.reunionService.obtenerReunionesPorVersion(proyecto, estado).subscribe({
      next: response => {
        console.log(response)
        if(requerimiento) {

          this.dataSource.data = response.filter((req: any) => req.version.trim().toLowerCase().includes(requerimiento.trim().toLowerCase()));

        } else {
          this.dataSource.data = response;
        }

      },
      error: err => {
        console.log(err)
      }
    })
  }

  reset(): void {
    this.filtroForm.reset();
    this.obtenerDatos()
  }

  obtenerProyectos(): void {

    this.proyectoService.obtenerProyectos(null, null, 1).subscribe({
      next: (response) => {

        response.data.forEach((proyecto: any) => {
          if (proyecto.cantidad_versiones > 0) {
            this.proyectos.push(proyecto)
          }
        });

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
    this.proyectosFiltrados = this.filtroForm.controls['id_proyecto'].valueChanges.pipe(
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

}
