import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ReunionService } from '../../../../services/reunion.service';
import { Router } from '@angular/router';
import { ProyectoService } from '../../../../services/proyecto.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, startWith, map, filter } from 'rxjs';
import { Proyecto } from '../../../../models/proyecto.model';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-nueva-reunion',
  imports: [
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatIconModule, ReactiveFormsModule, MatProgressSpinner, MatAutocompleteModule, AsyncPipe
],
  templateUrl: './nueva-reunion.component.html',
  styleUrl: './nueva-reunion.component.css'
})
export class NuevaReunionComponent implements OnInit{

  constructor(
    private reunionService: ReunionService,
    private proyectoService: ProyectoService,
    private router: Router
  ) {}

  isSubmitting = false;

  proyectos: Proyecto[] = [];
  proyectosFiltrados!: Observable<Proyecto[]>;

  versiones: any[] = [];
  versionesFiltradas!: Observable<any[]>;

  readonly dialogRef = inject(MatDialogRef<NuevaReunionComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  reunionForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
    lugar: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
    codigo: new FormControl(''),
    expiracion: new FormControl(new Date('1997-01-28T00:00:00')),
    id_proyecto: new FormControl<Proyecto | null>(null, [Validators.required]),
    id_version: new FormControl<any>(null, [Validators.required]),
    id_usuario: new FormControl(this.data.usuario.id, [Validators.required]),
    id_estado: new FormControl(1),
  })

  ngOnInit(): void {
    this.obtenerProyectos();
    this.configurarAutocomplete();
    
  }

  closeDialog(flag: boolean): void {
    this.dialogRef.close(flag);
  }

  calcularExpiracion(minutos: number): Date {
    const now = Date.now();
    return new Date(now + (minutos*60*1000));
  }

  generarCodigo(): string {
    return Math.random().toString(36).substr(2, 6).toUpperCase().padEnd(6, '0');
  }

  crearReunion(): void {
    if(this.reunionForm.valid) {
      this.isSubmitting = true;
      
      const expiration = this.calcularExpiracion(120);
      const code = this.generarCodigo();
      this.reunionForm.controls['expiracion'].setValue(expiration);
      this.reunionForm.controls['codigo'].setValue(code);

      if(this.reunionForm.controls['id_version'].value){
        this.reunionForm.controls['id_version'].setValue(this.reunionForm.controls['id_version'].value.id)
      }
      
      this.reunionService.crearNuevaReunion(this.reunionForm.value).subscribe({
        next: (response) => {
          this.agregarEncargadoInicial(response.codigo)
          this.router.navigate(['/reunion/'+response.codigo])
        },
        error: (err) => {
          console.error('El error: ', err);
        }
      })

      this.isSubmitting = false;
      this.dialogRef.close(true)
    }
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

  agregarEncargadoInicial(codigo: string): void {

    const token = localStorage.getItem('token');

    let id_reunion: number = 0;
    this.reunionService.obtenerReunionPorCodigo(codigo).subscribe({
      next: (res) => {
        id_reunion = res.id

        if(token){
          const decoded: any = jwtDecode(token);
          
          const data: any = {
            id_usuario: decoded.id,
            id_reunion: id_reunion,
            visitante: false
          }

          this.reunionService.agregarResponsables(data).subscribe({
            next: (res) => {
              console.log('Se agregó automáticamente al encargado de la reunión')
            },
            error: (err) => {
              console.log(err)
            }
          })
        }
      }
    })


    }

  }