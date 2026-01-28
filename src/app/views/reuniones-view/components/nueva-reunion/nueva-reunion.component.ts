import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReunionService } from '../../../../services/reunion.service';
import { Router } from '@angular/router';
import { ProyectoService } from '../../../../services/proyecto.service';
import { Observable, startWith, map } from 'rxjs';
import { Proyecto } from '../../../../models/proyecto.model';
import { jwtDecode } from 'jwt-decode';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatTimepickerModule} from '@angular/material/timepicker';
import { provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-nueva-reunion',
  imports: [
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatSlideToggleModule, MatTimepickerModule,
    MatIconModule, ReactiveFormsModule, MatProgressSpinner, MatAutocompleteModule, AsyncPipe, MatDatepickerModule
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
    lugar: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
    codigo: new FormControl(''),
    virtual: new FormControl<boolean>(false),
    motivo: new FormControl<any>(null),
    hora: new FormControl<any>(null),
    fecha: new FormControl<Date>(new Date()),
    fecha_reunion: new FormControl<Date|null>(null),
    expiracion: new FormControl(new Date('1997-01-28T00:00:00')),
    id_proyecto: new FormControl<Proyecto | null>(null, [Validators.required]),
    id_version: new FormControl<any>(null, [Validators.required]),
    id_usuario: new FormControl(this.data.usuario.id, [Validators.required]),
    id_estado: new FormControl(1),
  })

  programacion: boolean = false;
  maxDate!: Date;
  minDate!: Date;
  motivosReunion: any[] = [];

  ngOnInit(): void {
    this.obtenerMotivoReunion()
    this.obtenerProyectos();
    this.configurarAutocomplete();
    this.programacion = this.data.programacion || false;

    if(this.programacion){
      
      //Validando entrada del DatePicker
      this.minDate = new Date();
      this.maxDate = new Date();
      this.maxDate.setFullYear(this.minDate.getFullYear() + 2);

      this.reunionForm.controls['fecha'].addValidators([Validators.required]);
      this.reunionForm.controls['hora'].addValidators([Validators.required]);


    }
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
      
      if(!this.programacion){
        this.reunionService.crearNuevaReunion(this.reunionForm.value).subscribe({
          next: (response) => {
            setTimeout(()=>{
              this.agregarEncargadoInicial(response.id)
              this.router.navigate(['/reunion/'+response.codigo])
              this.isSubmitting = false;
              this.dialogRef.close(true)
            }, 500)
          },
          error: (err) => {
            console.error('El error: ', err);
            this.isSubmitting = false;
          }
        })
      }

      else {

        //MANEJANDO EL FLUJO DE LA PROGRAMACIÓN DE REUNIONES
        const f = this.reunionForm.controls['fecha'].value;
        const h = this.reunionForm.controls['hora'].value;

        if(!f || !h) {
          console.error('Ocurrió un error al manejar la fecha y hora');
          this.isSubmitting = false;
          return;
        }
        // Combinamos: Fecha de uno + Hora del otro
        const fechaFinal = new Date(f.getFullYear(), f.getMonth(), f.getDate(), h.getHours(), h.getMinutes());
        this.reunionForm.controls['fecha_reunion'].setValue(fechaFinal);

        this.reunionService.crearNuevaReunion(this.reunionForm.value).subscribe({
          next: (response) => {

            console.log(response)

            try {
              setTimeout(()=>{
                this.agregarEncargadoInicial(response.id)
                this.isSubmitting = false;
                this.dialogRef.close(response.codigo)
              }, 500)

            }catch (e) {
              console.error(e)
            }

          },
          error: (err) => {
            console.error('El error: ', err);
            this.isSubmitting = false;
          }
        })
 

      }
    }
  }

  agregarEncargadoInicial(id:number): void {

    const token = localStorage.getItem('token');

    const id_reunion = id

    if(token){
      const decoded: any = jwtDecode(token);
      
      const data: any = {
        id_usuario: decoded.id,
        id_reunion: id_reunion,
        visitante: false
      }

      this.reunionService.agregarResponsables(data).subscribe({
        next: (res) => {
          console.log(res)
        },
        error: (err) => {
          console.log(err)
        }
      })
    }

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



  obtenerMotivoReunion(): void {
    this.reunionService.obtenerMotivosReunion().subscribe({
      next: (response) => {
        this.motivosReunion = response;
      },
      error: (error) => {
        console.error('Error al obtener los motivos de reunión:', error);
      }
    });
  }

}