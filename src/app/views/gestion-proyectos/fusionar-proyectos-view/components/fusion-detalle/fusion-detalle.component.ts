import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-fusion-detalle',
  imports: [
    MatTableModule, MatPaginatorModule
  ],
  templateUrl: './fusion-detalle.component.html',
  styleUrl: './fusion-detalle.component.css'
})
export class FusionDetalleComponent implements OnChanges{

  @Input() versiones: any[] = [];

  displayedColumns: string[] = ['version', 'descripcion', 'estado_requerimiento', 'estado', 'acta', 'usuario', 'fecha'];

  dataSourceVersiones= new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator

  ngOnChanges(changes: SimpleChanges): void {

    if(changes['versiones'] && this.versiones.length > 0){
      this.dataSourceVersiones.data = this.versiones;
      this.dataSourceVersiones.paginator = this.paginator;
    }
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
