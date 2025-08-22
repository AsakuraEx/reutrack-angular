import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { ReunionService } from '../../../../services/reunion.service';

@Component({
  selector: 'app-reuniones-progreso',
  imports: [
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatTableModule, MatPaginatorModule
  ],
  templateUrl: './reuniones-progreso.component.html',
  styleUrl: './reuniones-progreso.component.css'
})
export class ReunionesProgresoComponent implements AfterViewInit {

    constructor(private reunionService: ReunionService) {}

    @Input() usuario: any;

    currentPage = 0;
    pageSize = 3;
    totalRecords = 0;

    displayedColumns: string[] = ['nombre', 'proyecto', 'createdAt','acciones'];
    dataSource: any[] = [];
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit(): void {
      this.paginator.page.subscribe((event: PageEvent) => {
        this.onPageChange(event)
      })
      this.cargarDatos()
    }

    onPageChange(event: PageEvent):void {
      this.totalRecords = event.length
      this.currentPage = event.pageIndex;
      this.pageSize = event.pageSize;
      this.cargarDatos();
    }

    cargarDatos():void {

      const page = this.currentPage + 1

      if(this.usuario.id_rol !== 1) {

        this.reunionService.obtenerReunionesIniciadas(this.pageSize, this.usuario.id, page).subscribe({
          next: (res) => {
            this.dataSource = res.data;
            this.totalRecords = res.totalRecords;
          },
          error: (err) => {
            console.log(err)
          }
        })

      } else {

        this.reunionService.obtenerReunionesIniciadas(this.pageSize, null, page).subscribe({
          next: (res) => {
            this.dataSource = res.data;
            this.totalRecords = res.totalRecords;
          },
          error: (err) => {
            console.log(err)
          }
        })

      }

    }

}
