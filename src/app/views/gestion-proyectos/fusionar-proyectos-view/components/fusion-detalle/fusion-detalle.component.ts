import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-fusion-detalle',
  imports: [
    MatTableModule, MatPaginatorModule
  ],
  templateUrl: './fusion-detalle.component.html',
  styleUrl: './fusion-detalle.component.css'
})
export class FusionDetalleComponent implements AfterViewInit{

  @Input() versiones!: any[];
  @Input() reuniones!: any[];

  displayedColumns: string[] = ['version', 'descripcion', 'estado_requerimiento', 'estado', 'acta', 'usuario', 'fecha'];

  pageSize = 10;
  currentPage = 0;
  totalRecords = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator

  ngAfterViewInit(): void {

    
    this.paginator.page.subscribe(pageEvent => {
      this.onPageEvent(pageEvent)
    })

    
  }

  onPageEvent(pageEvent: PageEvent): void{

    this.totalRecords = pageEvent.length;
    this.pageSize = pageEvent.pageSize;
    this.currentPage = pageEvent.pageIndex;


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
