import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tabla-actas',
  imports: [
    MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule, RouterLink, MatPaginatorModule
],
  templateUrl: './tabla-actas.component.html',
  styleUrl: './tabla-actas.component.css'
})
export class TablaActasComponent implements OnChanges, AfterViewInit{

  @Input() ActasDeAceptacion: any[] = [];
  totalRegistros: number = 0;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['proyecto', 'version', 'fecha', 'usuario', 'estado', 'acciones'];

  @ViewChild(MatPaginator) paginator !: MatPaginator

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['ActasDeAceptacion'] && this.ActasDeAceptacion){
        this.dataSource = new MatTableDataSource(this.ActasDeAceptacion);
        this.totalRegistros = this.ActasDeAceptacion.length
      }
  }

  ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator
  }

}
