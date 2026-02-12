import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProyectoService } from '../../../../services/proyecto.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Proyecto } from '../../../../models/proyecto.model';

@Component({
  selector: 'app-estado-requerimientos',
  imports: [
    MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatTableModule,
    ReactiveFormsModule, MatPaginatorModule, AsyncPipe, MatAutocompleteModule
  ],
  templateUrl: './estado-requerimientos.component.html',
  styleUrl: './estado-requerimientos.component.css'
})
export class EstadoRequerimientosComponent implements OnInit, AfterViewInit {

  constructor(
    private proyectoService: ProyectoService
  ) {}

  // Variables
  proyectos: any[] = [];
  proyectosFiltrados!: Observable<Proyecto[]>;
  estadosRequerimiento: any[] = [];
  listaRequerimientos: any[] = [];
  displayedColumns: string[] = ['proyecto', 'nombre','descripcion', 'estado'];
  dataSource = new MatTableDataSource<any>(this.listaRequerimientos)
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  enRequerimientos: number = 0;
  EnDesarrollo: number = 0;
  enQA: number = 0;
  enEspera: number = 0;
  detenidos: number = 0;
  pendientePublicar: number = 0;
  enPiloto: number = 0;
  publicado: number = 0;

  filtroForm = new FormGroup({
    id_proyecto: new FormControl<any>(null),
    estado_req: new FormControl<number|null>(null),
    requerimiento: new FormControl<string | null>(null)
  })
  
  // Metodos
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;  
  }

  ngOnInit(): void {
    this.obtenerEstados();
    this.obtenerRequerimientos();
    this.obtenerProyectos();
    this.configurarAutocomplete();
  }

  obtenerEstados(): void {
    this.proyectoService.obtenerEstadosRequerimiento().subscribe({
      next: response => {
        this.estadosRequerimiento = response;
      },
      error: err => {
        console.error(err)
      }
    })
  }

  obtenerRequerimientos(proyecto?: number, estado?: number): void {

    let id_estado: any = null;
    let id_proyecto: any = null;

    if(estado) id_estado = estado;
    if(proyecto) id_proyecto = proyecto

    this.proyectoService.obtenerVersiones(id_proyecto, null, null, 1, id_estado).subscribe({
      next: response => {

        const requerimientoBuscado = this.filtroForm.controls['requerimiento'].value;

        console.log(requerimientoBuscado)

        if(requerimientoBuscado) {

          this.dataSource.data = response.data.filter((req: any) => req.nombre.trim().toLowerCase().includes(requerimientoBuscado.trim().toLowerCase()));

        } else {
          this.dataSource.data = response.data;
        }

          this.enRequerimientos = 0;
          this.EnDesarrollo = 0;
          this.enQA = 0;
          this.enEspera = 0;
          this.detenidos = 0;
          this.pendientePublicar = 0;
          this.enPiloto = 0;
          this.publicado = 0;

        this.dataSource.data.forEach(requerimiento => {
          
          switch(requerimiento.estado_requerimiento?.id) {
            case 14:
              this.EnDesarrollo = this.EnDesarrollo + 1;
              break;
            case 15:
              this.enQA = this.enQA + 1;
              break;
            case 16:
              this.enEspera = this.enEspera + 1;
              break;
            case 17:
              this.detenidos = this.detenidos + 1;
              break;
            case 18:
              this.pendientePublicar = this.pendientePublicar + 1;
              break;
            case 19:
              this.enPiloto = this.enPiloto + 1;
              break;
            case 20:
              this.publicado = this.publicado + 1;
              break;
            default:
              this.enRequerimientos = this.enRequerimientos + 1;
              break;
          }
        });

      },
      error: error => {
        console.log(error)
      }
    })

  }

  onSubmit(): void {

    let id_proyecto: any = this.filtroForm.controls['id_proyecto']?.value?.id
    let id_estado: any = this.filtroForm.controls['estado_req'].value

    if(!id_estado) id_estado = null;
    if(!id_proyecto) id_proyecto = null;

    this.obtenerRequerimientos(id_proyecto, id_estado)
  }

  reset(): void {
    this.filtroForm.reset();
    this.obtenerRequerimientos();
  }

  obtenerProyectos(): void {

    this.proyectoService.obtenerProyectos(null, null, 1).subscribe({
      next: (response) => {

        response.data.forEach((proyecto: any) => {
          if (proyecto.cantidad_versiones > 0) {
            this.proyectos.push(proyecto)
          }
        });

        this.configurarAutocomplete();
      },
      error: (err) => {
        console.error('El error: ', err);
      }
    })

  }

  displayProyectoNombre(proyecto: any): string {
    return proyecto && proyecto.nombre ? proyecto.nombre : '';
  }

  private _filterNombres(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.proyectos.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  configurarAutocomplete(): void {
    this.proyectosFiltrados = this.filtroForm.controls['id_proyecto'].valueChanges.pipe(
      startWith(''),
      map(value => {
        // Si el valor es un string (búsqueda), filtrar
        if (typeof value === 'string') {
          return value ? this._filterNombres(value) : this.proyectos.slice();
        }
        // Si el valor es un objeto (selección), mostrar todos
        return this.proyectos.slice();
      })
    );
  }

}
