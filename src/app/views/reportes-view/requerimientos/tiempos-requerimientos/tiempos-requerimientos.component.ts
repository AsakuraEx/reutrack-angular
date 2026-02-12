import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Proyecto } from '../../../../models/proyecto.model';
import { map, Observable, startWith } from 'rxjs';
import { ProyectoService } from '../../../../services/proyecto.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-tiempos-requerimientos',
  imports: [
    MatIconModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, AsyncPipe, ReactiveFormsModule, MatButtonModule, MatTableModule, MatPaginatorModule
  ],
  templateUrl: './tiempos-requerimientos.component.html',
  styleUrl: './tiempos-requerimientos.component.css'
})
export class TiemposRequerimientosComponent implements OnInit, AfterViewInit {

  constructor(private proyectoService: ProyectoService){}

  proyectos: Proyecto[] = [];
  proyectosFiltrados!: Observable<Proyecto[]>;

  versiones: any[] = [];
  versionesFiltradas!: Observable<any[]>;

  filtroForm = new FormGroup({
    id_proyecto: new FormControl<any>(null, [Validators.required]),
    id_version: new FormControl<any>(null, [Validators.required]),
  })

  isSubmitting:boolean = false;

  versionConsultada!: string;
  dataSource = new MatTableDataSource()
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  displayedColumns: string[] = ['proyecto', 'version', 'usuario', 'fecha', 'tiempo'];

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;  
  }

  ngOnInit(): void {
    this.obtenerProyectos();
    this.configurarAutocomplete();
  }

  obtenerProyectos(): void {

    this.proyectoService.obtenerProyectos(1, null, 1).subscribe({
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

  ObtenerVersiones(id_proyecto: number): void {

    this.proyectoService.obtenerVersiones(id_proyecto, 1, null, 1).subscribe({
      next: (response) => {
        this.versiones = response.data;
        this.configurarAutocompleteVersiones()
      },
      error: (err) => {
        console.error('El error: ', err);
      }
    })


  }

  displayVersionNombre(version: any): string {
    return version && version.nombre ? version.nombre : '';
  }

  private _filterVersiones(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.versiones.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  configurarAutocompleteVersiones(): void {
    this.versionesFiltradas = this.filtroForm.controls['id_version'].valueChanges.pipe(
      startWith(''),
      map(value => {
        // Si el valor es un string (búsqueda), filtrar
        if (typeof value === 'string') {
          return value ? this._filterVersiones(value) : this.versiones.slice();
        }
        // Si el valor es un objeto (selección), mostrar todos
        return this.versiones.slice();
      })
    );
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

  formatearTiempo(ms: number): string {
    const segundos = Math.floor(ms / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const meses = Math.floor(dias / 30);
    const anios = Math.floor(meses / 12);

    const s = segundos % 60;
    const m = minutos % 60;
    const h = horas % 24;
    const d = dias % 30;
    const mes = meses % 12;

    if (anios > 0) return `${anios} años, ${mes} meses, ${d} días, ${h} horas, ${m} minutos, ${s} segundos`;
    if (meses > 0) return `${meses} meses, ${d} días, ${h} horas, ${m} minutos, ${s} segundos`;
    if (dias > 0) return `${dias} días, ${h} horas, ${m} minutos, ${s} segundos`;
    if (horas > 0) return `${horas} horas, ${m} minutos, ${s} segundos`;
    if (minutos > 0) return `${minutos} minutos, ${s} segundos`;
    
    return `${segundos} segundos`;
  }

  onSubmit(): void{
    if(this.filtroForm.valid) {

      //Crea el dato del filtro
      const id_version = this.filtroForm.controls['id_version']?.value.id;
      const nombre_version = this.filtroForm.controls['id_version']?.value.nombre;

      //Asigna a variable para mostrar en template
      this.versionConsultada = nombre_version;

      // Ejecuta el endpoint
      this.proyectoService.obtenerBitacoraVersion(id_version).subscribe({
        next: response => {

          //Ordena por fecha
          const dataOrdenada = response.sort((a:any ,b:any)=>{
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          })

          // Se mapea la data para agregar el tiempo transcurrido
          this.dataSource.data = dataOrdenada.map((registro:any, index:any, array:any) => {
            
            // Mapea el registro inicial con la fecha de creación del requerimiento
            if(index === 0) {
              const fechaActual = new Date(registro.createdAt).getTime();
              const fechaAnterior = new Date(registro.version.createdAt).getTime();

              const diferenciaMs = fechaActual - fechaAnterior;
              return { 
                ...registro, 
                tiempoTranscurrido: this.formatearTiempo(diferenciaMs) 
              }
            }

            // Mapea los registros subsecuentes
            const fechaActual = new Date(registro.createdAt).getTime();
            const fechaAnterior = new Date(array[index - 1].createdAt).getTime();

            const diferenciaMs = fechaActual - fechaAnterior;
            return {
              ...registro,
              tiempoTranscurrido: this.formatearTiempo(diferenciaMs)
            }
          })
          this.isSubmitting = true;
        }
      })

    }
  }

  reset(): void {
    this.filtroForm.reset();
    this.isSubmitting = false;
    // Reiniciar consulta de tabla
  }




}
