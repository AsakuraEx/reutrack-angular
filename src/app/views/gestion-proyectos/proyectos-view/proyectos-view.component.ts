import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { ProyectoService } from '../../../services/proyecto.service';
import { MatDialog } from '@angular/material/dialog';
import { FormProyectosComponent } from './components/form-proyectos/form-proyectos.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';



@Component({
  selector: 'app-proyectos-view',
  imports: [
    MatButtonModule, MatIconModule, MatTableModule, MatTooltipModule,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    RouterLink, MatPaginatorModule
],
  templateUrl: './proyectos-view.component.html',
  styleUrl: './proyectos-view.component.css'
})
export class ProyectosViewComponent implements AfterViewInit{

  constructor(
    private proyectoService: ProyectoService
  ){}


  // Paginación
  currentPage = 0;
  pageSize = 10;
  totalRecords = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator


  proyectos: any = [];
  displayedColumns = ['proyecto', 'usuario', 'fecha', 'accion'];
  readonly dialog = inject(MatDialog)

  proyectoBuscado = new FormControl('');

  ngAfterViewInit(): void {

    this.paginator.page.subscribe((event: PageEvent) => {
      this.onPageEvent(event);
    })
    this.obtenerProyectos();
    
  }

  onPageEvent(event: PageEvent):void {
    this.totalRecords = event.length;
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.obtenerProyectos();
  }

  obtenerProyectos():void {

    const page = this.currentPage + 1;     // ESTO ES HIPER IMPORTANTE

    this.proyectoService.obtenerProyectos(null, this.pageSize, page).subscribe({
      next: response => {
        console.log(response)
        this.proyectos = response.data
        this.totalRecords = response.totalRecords
      },
      error: err => {
        console.log(err)
      } 
    })

  }

  mostrarModal(proyecto?: any): void {

    let dialogRef;

    if(!proyecto){

      dialogRef = this.dialog.open(FormProyectosComponent, {
        minWidth: '340px'
      });

    }else{

      dialogRef = this.dialog.open(FormProyectosComponent, {
        minWidth: '340px',
        data: proyecto
      });

    }

    dialogRef.afterClosed().subscribe(result => {
        if(result === true) {
          this.obtenerProyectos();
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
