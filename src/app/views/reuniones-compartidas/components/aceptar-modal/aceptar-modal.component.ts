import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Proyecto } from '../../../../models/proyecto.model';
import { map, Observable, startWith } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProyectoService } from '../../../../services/proyecto.service';
import { AsyncPipe } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { ReunionService } from '../../../../services/reunion.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-aceptar-modal',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, AsyncPipe, MatDialogContent],
  templateUrl: './aceptar-modal.component.html',
  styleUrl: './aceptar-modal.component.css'
})
export class AceptarModalComponent implements OnInit{

  constructor(
    private proyectoService: ProyectoService,
    private reunionService: ReunionService,
    private toastService: HotToastService
  ){}

  readonly dialogRef = inject(MatDialogRef<AceptarModalComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  proyectos: Proyecto[] = [];
  proyectosFiltrados!: Observable<Proyecto[]>;

  submit: boolean = false;

  versiones: any[] = [];
  versionesFiltradas!: Observable<any[]>;

  reunionForm = new FormGroup({
    id_proyecto: new FormControl<Proyecto | null>(null),
    id_version: new FormControl<any>(null, [Validators.required]),
  })

  ngOnInit(): void {
    this.obtenerProyectos();
    this.configurarAutocomplete();
  }

  onSubmit(): void {
    this.submit = true;

    if(this.reunionForm.invalid) {
      this.submit = false;
      return;
    }

    const token = localStorage.getItem('token');
    if(!token) return;
    const decoded: any = jwtDecode(token);

    const data = {
      id_reunion_compartida: this.data.id,
      id_version: this.reunionForm.controls['id_version'].value.id,
      id_usuario: decoded.id
    }

    this.reunionService.aceptarReunionCompartida(data).subscribe({
      next: response => {
        this.toastService.success(response.msj, {
          duration: 3000,
          position: 'top-right'
        })
        this.onCancelClick(true);
      },
      error: err => {
        this.toastService.error(err.error.error, {
          duration: 3000,
          position: 'top-right'
        })
      }
    })
    
    this.submit = false;
  }

  onCancelClick(result: boolean = false): void {
    this.dialogRef.close(result);
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
    this.proyectosFiltrados = this.reunionForm.controls['id_proyecto'].valueChanges.pipe(
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
    this.versionesFiltradas = this.reunionForm.controls['id_version'].valueChanges.pipe(
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

}
