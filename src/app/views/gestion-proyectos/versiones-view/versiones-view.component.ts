import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ProyectoService } from '../../../services/proyecto.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { AgregarVersionFormComponent } from './agregar-version-form/agregar-version-form.component';
import { CancelarVersionComponent } from './cancelar-version/cancelar-version.component';

@Component({
  selector: 'app-versiones-view',
  imports: [
    MatIconModule, MatButtonModule, MatTableModule, MatPaginatorModule,
    RouterLink, MatTooltipModule
],
  templateUrl: './versiones-view.component.html',
  styleUrl: './versiones-view.component.css'
})
export class VersionesViewComponent implements AfterViewInit{

  constructor(
    private proyectoService: ProyectoService,
    private route: ActivatedRoute
  ){}

  readonly dialog = inject(MatDialog)

  id_proyecto:number = 0;

  proyectoActual:any = {}
  versiones: any = [];
  displayedColumns: string[] = ['version', 'descripcion','estado', 'acta', 'usuario', 'fecha', 'accion'];

  estados:any = {
    Iniciado: 'bg-yellow-500',
    Finalizado: 'bg-blue-500',
    Cancelado: 'bg-red-500'
  }

  pageSize = 10;
  currentPage = 0;
  totalRecords = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator

  ngAfterViewInit(): void {

    this.id_proyecto = Number(this.route.snapshot.paramMap.get('id_proyecto'));
    
    this.paginator.page.subscribe(pageEvent => {
      this.onPageEvent(pageEvent, this.id_proyecto)
    })
    this.obtenerProyecto(this.id_proyecto)
    
  }

  mostrarAgregarVersion(): void {
    const dialogRef = this.dialog.open(AgregarVersionFormComponent, {
      data: this.id_proyecto
    });

    dialogRef.afterClosed().subscribe(result=>{
      if(result) {
        this.obtenerProyecto(this.id_proyecto);
      }
    })
  }

  mostrarActualizarVersion(version: any): void {
    const dialogRef = this.dialog.open(AgregarVersionFormComponent, {
      data: version
    });

    dialogRef.afterClosed().subscribe(result=>{
      if(result) {
        this.obtenerProyecto(this.id_proyecto);
      }
    }) 
  }

  mostrarCancelarVersion(version: any): void {
    const dialogRef = this.dialog.open(CancelarVersionComponent, {
      data: version
    });

    dialogRef.afterClosed().subscribe(result=>{
      if(result) {
        this.obtenerProyecto(this.id_proyecto);
      }
    }) 
  }

  onPageEvent(pageEvent: PageEvent, id_proyecto: number): void{

    this.totalRecords = pageEvent.length;
    this.pageSize = pageEvent.pageSize;
    this.currentPage = pageEvent.pageIndex;
    this.obtenerVersiones(id_proyecto);

  }

  claseEstado (estado: string): string {
    return `${ this.estados[estado] }`
  }

  obtenerProyecto(id_proyecto: number): void {

    this.proyectoService.obtenerProyecto(id_proyecto).subscribe({
      next: resp => {
        this.proyectoActual = resp;
        this.obtenerVersiones(this.proyectoActual.id)
      },
      error: e => {
        console.error(e)
      }
    })

  }

  obtenerVersiones(id_proyecto: number): void {

    const page = this.currentPage + 1

    this.proyectoService.obtenerVersiones(id_proyecto, null, this.pageSize, page).subscribe({
      next: resp => {
        this.versiones = resp.data;
        this.totalRecords = resp.totalRecords;
        console.log(this.versiones)
      },
      error: e => {
        console.error(e)
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
