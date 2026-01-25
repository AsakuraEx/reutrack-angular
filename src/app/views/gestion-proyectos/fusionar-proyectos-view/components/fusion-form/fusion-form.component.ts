import { Component, EventEmitter, Output } from '@angular/core';
import { ProyectoService } from '../../../../../services/proyecto.service';
import { Proyecto } from '../../../../../models/proyecto.model';
import { map, Observable, startWith } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { jwtDecode } from 'jwt-decode';
import { ReunionService } from '../../../../../services/reunion.service';

@Component({
  selector: 'app-fusion-form',
  imports: [
    MatAutocompleteModule, MatInputModule, MatFormFieldModule, AsyncPipe, ReactiveFormsModule, MatIconModule, MatButtonModule
  ],
  templateUrl: './fusion-form.component.html',
  styleUrl: './fusion-form.component.css'
})
export class FusionFormComponent {

  constructor(
    private proyectoService: ProyectoService,
    private reunionService: ReunionService
  ) {}

  isSubmitting = false;

  @Output() reuniones = new EventEmitter<any[]>;
  @Output() versiones = new EventEmitter<any[]>;

  proyectosA: Proyecto[] = [];
  proyectosFiltradosA!: Observable<Proyecto[]>;
  proyectosB: Proyecto[] = [];
  proyectosFiltradosB!: Observable<Proyecto[]>;

  fusionForm = new FormGroup({
    id_proyecto_a: new FormControl<number | any>(0, [Validators.required]),
    id_proyecto_b: new FormControl<number | any>(0, [Validators.required]),
    id_usuario: new FormControl<number>(0, [Validators.required])
  })

  ngOnInit(): void {
    this.obtenerProyectosA();
    this.configurarAutocompleteA();

    this.obtenerProyectosB();
    this.configurarAutocompleteB();

  }

  obtenerIdUsuario(): number {
    const token = localStorage.getItem('token');
    if(!token) return 0;
    const decoded: any = jwtDecode(token);

    const usuario: number = decoded.id;

    return usuario
  }

  onSubmit(): void {

    this.isSubmitting = true;

    const usuario = this.obtenerIdUsuario();

    this.fusionForm.controls['id_usuario'].setValue(usuario);

    if(this.fusionForm.valid) {
      const proyecto_a: number = this.fusionForm.controls['id_proyecto_a'].value?.id;
      const proyecto_b: number = this.fusionForm.controls['id_proyecto_b'].value?.id;
  
  
      const data = {
        id_proyecto_a: proyecto_a,
        id_proyecto_b: proyecto_b,
        id_usuario: usuario
      }
      console.log(data)

      this.isSubmitting = false;
    }

    this.isSubmitting = false;
  }

  obtenerInformacion(): void {

      const proyecto_b: number = this.fusionForm.controls['id_proyecto_b'].value?.id;
  
      if(proyecto_b < 1) return;

      console.log("proyecto: " + proyecto_b)
      this.obtenerReuniones(proyecto_b)
      this.obtenerVersiones(proyecto_b)


  }
    
  // OBTENIENDO DATOS DE CONSOLIDACION
  obtenerReuniones(id_proyecto: number): void {

    if(!id_proyecto) return;

    this.reunionService.obtenerReuniones(null, null, null, id_proyecto, null, 1, null, null).subscribe({
      next: response => {
        this.reuniones.emit(response.data);
        
      },
      error: err => {
        console.error(err)
      }
      
    })

  }


  obtenerVersiones(id_proyecto: number): void {
    
    if(!id_proyecto) return;

    this.proyectoService.obtenerVersiones(id_proyecto, null, null, 1).subscribe({
      next: response => {
        this.versiones.emit(response.data);
      },
      error: err => {
        console.error(err);
      }
    })
  }

  // MANEJO DE AMBOS AUTOCOMPLETE

  obtenerProyectosA(): void {
    
    this.proyectoService.obtenerProyectos(null, null, 1).subscribe({
      next: (response) => {
        
        response.data.forEach((proyecto: any) => {
          if (proyecto.cantidad_versiones > 0) {
            this.proyectosA.push(proyecto)
          }
        });
        
        this.configurarAutocompleteA();
      },
      error: (err) => {
        console.error('El error: ', err);
      }
    })
    
  }
  
  displayProyectoNombreA(proyecto: any): string {
    return proyecto && proyecto.nombre ? proyecto.nombre : '';
  }
  
  private _filterNombresA(name: string): any[] {
    const filterValue = name.toLowerCase();
    
    return this.proyectosA.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }
  
  configurarAutocompleteA(): void {
    this.proyectosFiltradosA = this.fusionForm.controls['id_proyecto_a'].valueChanges.pipe(
      startWith(''),
      map(value => {
        // Si el valor es un string (búsqueda), filtrar
        if (typeof value === 'string') {
          return value ? this._filterNombresA(value) : this.proyectosA.slice();
        }
        // Si el valor es un objeto (selección), mostrar todos
        return this.proyectosA.slice();
      })
    );
  }

  obtenerProyectosB(): void {
    
    this.proyectoService.obtenerProyectos(null, null, 1).subscribe({
      next: (response) => {
        
        response.data.forEach((proyecto: any) => {
          if (proyecto.cantidad_versiones > 0) {
            this.proyectosB.push(proyecto)
          }
        });
        
        this.configurarAutocompleteB();
      },
      error: (err) => {
        console.error('El error: ', err);
      }
    })
    
  }
  
  displayProyectoNombreB(proyecto: any): string {
    return proyecto && proyecto.nombre ? proyecto.nombre : '';
  }
  
  private _filterNombresB(name: string): any[] {
    const filterValue = name.toLowerCase();
    
    return this.proyectosB.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }
  
  configurarAutocompleteB(): void {
    this.proyectosFiltradosB = this.fusionForm.controls['id_proyecto_b'].valueChanges.pipe(
      startWith(''),
      map(value => {
        // Si el valor es un string (búsqueda), filtrar
        if (typeof value === 'string') {
          return value ? this._filterNombresB(value) : this.proyectosB.slice();
        }
        // Si el valor es un objeto (selección), mostrar todos
        return this.proyectosB.slice();
      })
    );
  }


  
}