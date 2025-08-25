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
import { Observable, startWith, map } from 'rxjs';

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

  proyectos: any[] = [];
  proyectosFiltrados!: Observable<any[]>;

  readonly dialogRef = inject(MatDialogRef<NuevaReunionComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  reunionForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
    lugar: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
    codigo: new FormControl(''),
    expiracion: new FormControl(new Date('1997-01-28T00:00:00')),
    id_proyecto: new FormControl(null, [Validators.required]),
    id_version: new FormControl(null, [Validators.required]),
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
      
      this.reunionService.crearNuevaReunion(this.reunionForm.value).subscribe({
        next: (response) => {
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


}
