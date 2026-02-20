import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ReunionService } from '../../../../services/reunion.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-reuniones-motivo',
  imports: [
    MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule,
    MatDatepickerModule
  ],
  templateUrl: './reuniones-motivo.component.html',
  styleUrl: './reuniones-motivo.component.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReunionesMotivoComponent implements OnInit, AfterViewInit{

  constructor(private reunionService: ReunionService){}

  filtroForm = new FormGroup({
    id_motivo: new FormControl<number>(0),
    fechaInicio: new FormControl<Date | null>(null),
    fechaFin: new FormControl<Date | null>(null)
  });

  motivosReunion: any[] = [];

  reuniones: any[] = [];

  displayedColumns: string[] = ['fecha_programada', 'nombre', 'lugar', 'proyecto', 'requerimiento', 'motivo'];

  currentRows: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;

  isSubmitting: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator

  fechaActual:Date = new Date();

  ngOnInit(): void {
    this.obtenerMotivoReunion()
    this.obtenerReunionesPorMotivo();
  }

  ngAfterViewInit(): void {
      this.paginator.page.subscribe((event: PageEvent)=>{
        this.onPageEvent(event)
      })
  }
  
  obtenerMotivoReunion(): void {

    this.reunionService.obtenerMotivosReunion().subscribe({
      next: (response) => {
        this.motivosReunion = response;
      },
      error: (error) => {
        console.error('Error al obtener los motivos de reunión:', error);
      }
    });
  }

  obtenerReunionesPorMotivo(motivo?: number): void {

    let page: number = 1

    if(motivo && this.isSubmitting) this.currentPage = 0;
    page = this.currentPage + 1;

    this.reunionService.obtenerReunionesPorMotivo(motivo, this.pageSize, page).subscribe({
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
    const motivo = this.filtroForm.controls['id_motivo'].value;

    this.isSubmitting = true;

    if(motivo) {
      this.obtenerReunionesPorMotivo(motivo);
      this.isSubmitting = false;
      return;
    } else {
      this.obtenerReunionesPorMotivo();
      this.isSubmitting = false;
    }

  }

  reset(): void {

    this.filtroForm.reset();
    this.currentPage = 0;
    this.currentRows = 0;
    this.pageSize = 10;
    this.obtenerReunionesPorMotivo();

  }

  onPageEvent(event: PageEvent):void {
    this.currentRows = event.length;
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    const motivo = this.filtroForm.controls['id_motivo'].value;
    if(motivo) {
      this.obtenerReunionesPorMotivo(motivo)
    } else {
      this.obtenerReunionesPorMotivo()
    }

  }

}
