import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ReunionService } from '../../../services/reunion.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-reuniones-reactivadas',
  imports: [
    MatTableModule, MatPaginatorModule
  ],
  templateUrl: './reuniones-reactivadas.component.html',
  styleUrl: './reuniones-reactivadas.component.css'
})
export class ReunionesReactivadasComponent implements AfterViewInit {

  constructor(
    private reunionService: ReunionService
  ){}

  displayedColumns: string[] = ['proyecto', 'reunion', 'encargado','reactivado_por', 'justificacion', 'fecha'];
  dataSource = new MatTableDataSource();
  totalRegistros: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator

  ngAfterViewInit(): void {
    this.obtenerReunionesReactivadas()
  }

  obtenerReunionesReactivadas(): void {

    this.reunionService.obtenerReunionesReactivadas().subscribe({
      next: res => {
        console.log(res)
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator
        this.totalRegistros = res.length;
      },
      error: err => {
        console.error(err)
      }
    })

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


}
