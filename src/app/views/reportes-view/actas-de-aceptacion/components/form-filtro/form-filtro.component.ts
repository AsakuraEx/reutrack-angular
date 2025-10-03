import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProyectoService } from '../../../../../services/proyecto.service';
import { Proyecto } from '../../../../../models/proyecto.model';
import { map, Observable, startWith } from 'rxjs';
import { ActaAceptacionService } from '../../../../../services/acta-aceptacion.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-form-filtro',
  imports: [
    MatFormFieldModule, MatButtonModule, MatAutocompleteModule, MatInputModule, ReactiveFormsModule, AsyncPipe, MatSelectModule
  ],
  templateUrl: './form-filtro.component.html',
  styleUrl: './form-filtro.component.css'
})
export class FormFiltroComponent implements AfterViewInit {

  constructor(
    private proyectoService: ProyectoService,
    private actaAceptacionService: ActaAceptacionService
  ){}

  @Output() actasDeReunionFiltradas = new EventEmitter<any[]>();

  actasDeAceptacion: any[] = [];

  proyectos: Proyecto[] = [];
  proyectosFiltrados!: Observable<Proyecto[]>;

  formFiltro = new FormGroup({
    proyecto: new FormControl<number>(0),
    estado: new FormControl<number>(0)
  })

  ngAfterViewInit(): void {
    this.obtenerProyectos();
    this.configurarAutocomplete();
  }

  displayProyectoNombre(proyecto: any): string {
    return proyecto && proyecto.nombre ? proyecto.nombre : '';
  }

  private _filterNombres(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.proyectos.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  configurarAutocomplete(): void {
    this.proyectosFiltrados = this.formFiltro.controls['proyecto'].valueChanges.pipe(
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

  obtenerProyectos(): void {

    this.proyectoService.obtenerProyectos(1, null, 1).subscribe({
      next: (response) => {
        this.proyectos = response.data;
        this.configurarAutocomplete();
      },
      error: (err) => {
        console.error('El error: ', err);
      }
    })

  }

  onSubmit(): void {

    const id_proyecto:any = this.formFiltro.controls['proyecto'].value;
    const estado:any = this.formFiltro.controls['estado'].value;
    console.log(id_proyecto.id)

    this.actaAceptacionService.obtenerActasDeAceptacion(id_proyecto.id, estado).subscribe({
      next: response => {
        this.actasDeAceptacion = response;
        this.actasDeReunionFiltradas.emit(this.actasDeAceptacion);
      },
      error: err => {
        console.log(err);
      }
    })

  }

}
