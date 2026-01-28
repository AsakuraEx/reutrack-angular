import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { ProyectoService } from '../../../../../services/proyecto.service';
import { Proyecto } from '../../../../../models/proyecto.model';
import { map, Observable, startWith } from 'rxjs';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { jwtDecode } from 'jwt-decode';
import { HotToastService } from '@ngxpert/hot-toast';
import { MatDialog } from '@angular/material/dialog';
import { FusionModalComponent } from '../fusion-modal/fusion-modal.component';

@Component({
  selector: 'app-fusion-form',
  imports: [
    MatAutocompleteModule, MatInputModule, MatFormFieldModule, AsyncPipe, ReactiveFormsModule,
     MatIconModule, MatButtonModule
  ],
  templateUrl: './fusion-form.component.html',
  styleUrl: './fusion-form.component.css'
})
export class FusionFormComponent {

  constructor(
    private proyectoService: ProyectoService,
    private toastService: HotToastService
  ) {}

  isSubmitting = false;

  @Output() versiones = new EventEmitter<any[]>;

  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective

  proyectosA: Proyecto[] = [];
  proyectosFiltradosA!: Observable<Proyecto[]>;
  proyectosB: Proyecto[] = [];
  proyectosFiltradosB!: Observable<Proyecto[]>;

  fusionForm = new FormGroup({
    id_proyecto_a: new FormControl<number | any>(0, [Validators.required]),
    id_proyecto_b: new FormControl<number | any>(0, [Validators.required]),
    id_usuario: new FormControl<number>(0, [Validators.required])
  })

  readonly dialogFusion = inject(MatDialog);

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

      if(proyecto_a === proyecto_b) {
        
        this.toastService.error('Los proyectos seleccionados no pueden ser iguales.',{
          position: 'top-right',
          duration: 3000
        });
        return;

      }
    
      const data = {
        id_proyecto_a: proyecto_a,
        id_proyecto_b: proyecto_b,
        id_usuario: usuario
      }

      const dialogRef =this.dialogFusion.open(FusionModalComponent, {
        data: {
          form: data,
          event: this.versiones
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result === true) {
          this.toastService.success('Los proyectos se han fusionado correctamente.', {
            position: 'top-right',
            duration: 3000
          });
          this.formGroupDirective.resetForm();
          this.fusionForm.reset();
          this.isSubmitting = false;
        }
      })

      this.isSubmitting = false;

    }

  }

  obtenerInformacion(): void {

    const proyecto_b: number = this.fusionForm.controls['id_proyecto_b'].value?.id;
    const proyecto_a: number = this.fusionForm.controls['id_proyecto_a'].value?.id;

    if(proyecto_b < 1) {
      this.toastService.error('Selecciona una proyecto a eliminar válido.', {
        position: 'top-right',
        duration: 3000
      })
      return;
    } 

    if(!proyecto_a){
      this.toastService.error('Primero seleccione el proyecto al que se consolidará.', {
        position: 'top-right',
        duration: 3000
      })
      this.fusionForm.controls['id_proyecto_b'].setValue(null);
      return;
    }

    if(proyecto_a === proyecto_b) {
      this.toastService.error('Los proyectos seleccionados no pueden ser iguales.', {
        position: 'top-right',
        duration: 3000
      })
      this.fusionForm.controls['id_proyecto_b'].setValue(null);
      this.versiones.emit([]);
      return;
    }

    this.obtenerVersiones(proyecto_b)


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
          this.proyectosA.push(proyecto)
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
          this.proyectosB.push(proyecto)
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
    
    const valorA = this.fusionForm.controls['id_proyecto_a'].value;
    const idProyectoA = (valorA && typeof valorA === 'object') ? valorA.id : null;

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