import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ReunionService } from '../../services/reunion.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from "@angular/material/tooltip";
import { MatDialog } from '@angular/material/dialog';
import { AceptarModalComponent } from './components/aceptar-modal/aceptar-modal.component';
import { CancelarModalComponent } from './components/cancelar-modal/cancelar-modal.component';

@Component({
  selector: 'app-reuniones-compartidas',
  imports: [
    MatIconModule, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule,
    MatDatepickerModule, MatCheckboxModule, MatInputModule,
    MatTooltip
],
  providers: [provideNativeDateAdapter()],
  templateUrl: './reuniones-compartidas.component.html',
  styleUrl: './reuniones-compartidas.component.css'
})
export class ReunionesCompartidasComponent implements OnInit, AfterViewInit{

  constructor(private reunionService: ReunionService){}

  filtroForm = new FormGroup({
    remitente: new FormControl<string>(''),
    fechaInicio: new FormControl<Date | null>(null),
    fechaFin: new FormControl<Date | null>(null),
    soloAceptadas: new FormControl<Boolean>(false)
  });

  reuniones: any[] = [];

  displayedColumns: string[] = ['fecha_envio', 'fecha_reunion', 'remitente', 'nombre_reunion', 'lugarReunion', 'origen', 'accion'];

  currentRows: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;

  isSubmitting: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator

  readonly dialog = inject(MatDialog)

  ngOnInit(): void {
    this.obtenerReunionesCompartidas();
  }

  ngAfterViewInit(): void {
      this.paginator.page.subscribe((event: PageEvent)=>{
        this.onPageEvent(event)
      })
  }

  obtenerReunionesCompartidas(data?: any): void {

    let page: number = 1

    if(this.isSubmitting) this.currentPage = 0;
    page = this.currentPage + 1;

    this.reunionService.obtenerReunionesCompartidas(data, this.pageSize, page).subscribe({
      next: (response: any) => {
        this.reuniones = response.data;
        this.currentRows = response.totalRecords;
      },
      error: err => {
        console.error(err)
      }
    })

  }

  onSubmit(): void {

    this.isSubmitting = true;
    this.obtenerReunionesCompartidas(this.filtroForm.value);
    this.isSubmitting = false;

  }

  reset(): void {

    this.filtroForm.reset();
    this.currentPage = 0;
    this.currentRows = 0;
    this.pageSize = 10;
    this.obtenerReunionesCompartidas();

  }

  onPageEvent(event: PageEvent):void {
    this.currentRows = event.length;
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    //const motivo = this.filtroForm.controls['id_motivo'].value;
    this.obtenerReunionesCompartidas()
  }

  transformarFecha(fecha: string): string  {
      
      const nuevaFecha = new Date(fecha)

      const fechaFormateada = nuevaFecha.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',   // Hora en formato de dos dígitos
          minute: '2-digit', // Minutos en formato de dos dígitos
          second: '2-digit', // Segundos en formato de dos dígitos
          hour12: true
      });

      return fechaFormateada
  }

  mostrarModalAceptar(registro: any): void {
    const dialogRef = this.dialog.open(AceptarModalComponent, {
      data: registro,
      minWidth: '512px',
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.onSubmit();
      }

    })
  }

  mostrarModalRechazar(id_reunion_compartida: number) {
    const dialogRef = this.dialog.open(CancelarModalComponent, {
      data: id_reunion_compartida,
      minWidth: '512px',
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.onSubmit();
      }

    })
  }

}
