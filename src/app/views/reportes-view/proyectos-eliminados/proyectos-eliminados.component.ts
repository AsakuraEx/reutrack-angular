import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProyectoService } from '../../../services/proyecto.service';

@Component({
  selector: 'app-proyectos-eliminados',
  imports: [
    MatTableModule, MatPaginatorModule
  ],
  templateUrl: './proyectos-eliminados.component.html',
  styleUrl: './proyectos-eliminados.component.css'
})
export class ProyectosEliminadosComponent implements AfterViewInit {

  constructor(
    private proyectoService: ProyectoService
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator

  displayedColumns: string[] = ['id','proyecto', 'usuario', 'fecha'];
  dataSource = new MatTableDataSource();
  totalRegistros: number = 0;

  ngAfterViewInit(): void {
      this.obtenerProyectosEliminados();
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


  obtenerProyectosEliminados(): void {

    this.proyectoService.obtenerProyectosEliminados().subscribe({
      next: res => {
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = res.length;
      },
      error: err => {
        console.error(err)
      }
    })

  }


}
