import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ListaFuncionalidadesComponent } from '../lista-funcionalidades/lista-funcionalidades.component';
import { ActivatedRoute } from '@angular/router';
import { ActaAceptacionService } from '../../../../services/acta-aceptacion.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-funcionalidades',
  imports: [
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSlideToggleModule, ListaFuncionalidadesComponent, ReactiveFormsModule
  ],
  templateUrl: './funcionalidades.component.html',
  styleUrl: './funcionalidades.component.css'
})
export class FuncionalidadesComponent {

  constructor(
    private route: ActivatedRoute,
    private actaAceptacionService: ActaAceptacionService,
    private toastService: HotToastService,
  ){}

  @ViewChild(FormGroupDirective) formDirective?: FormGroupDirective

  @Input() acta_aceptacion!:any

  @Output() ContadorEventEmitter = new EventEmitter<number>();

  funcionalidadSeleccionada: any = null;

  contador: number = 0; 
  
  id_acta!: number;
  funcionalidades: any[] = [];
  formFuncionalidad = new FormGroup({
    id: new FormControl<number | null>(null),
    descripcion: new FormControl('', {
      updateOn: 'blur',
      validators: [Validators.required]
    }),
    aprobado: new FormControl(false),
    id_acta: new FormControl(this.id_acta, [Validators.required]),
    cambio_solicitado: new FormControl('')
  })

  ngOnInit(): void {
    this.obtenerFuncionalidadesPorActa()
  }
  
  obtenerFuncionalidadesPorActa(): void {
    this.id_acta = Number(this.route.snapshot.paramMap.get('id_acta'));
    this.actaAceptacionService.obtenerFuncionesPorActa(this.id_acta).subscribe(response => {
      this.funcionalidades = response
      this.contador = this.funcionalidades.filter(f => f.aprobado === true).length;
      this.ContadorEventEmitter.emit(this.contador);
    })
  }

  agregarFuncionalidades(): void {



    this.formFuncionalidad.controls['id_acta'].setValue(this.id_acta)

    if(this.formFuncionalidad.valid){

      if(this.formFuncionalidad.controls['id'].value){

          this.actaAceptacionService.editarFunciones(this.formFuncionalidad.value).subscribe({
            next: () => {
              this.toastService.success('Se edito la funcionalidad del acta de aceptación', {
                position: 'top-right',
                duration: 3000
              })
              this.obtenerFuncionalidadesPorActa()
              this.formDirective?.resetForm()
              this.formFuncionalidad.reset()
              this.funcionalidadSeleccionada = null;
            }, 
            error: e => {
              this.toastService.error('Ocurrió un error al editar la funcionalidad', {  
                position: 'top-right',
                duration: 3000
              })
            }
        
        })
        
      } else {

        this.actaAceptacionService.agregarFunciones(this.formFuncionalidad.value).subscribe({
          next: () => {
            this.toastService.success('Se agrego la funcionalidad al acta de aceptación', {
              position: 'top-right',
              duration: 3000
            })
            this.obtenerFuncionalidadesPorActa()
            this.formDirective?.resetForm()
            this.formFuncionalidad.reset()
          },
          error: e => {
            console.log(e)
          }
        })
      }

    }
  }

  obtenerFuncionalidadSeleccionada(funcionalidad: Event): void {
    this.funcionalidadSeleccionada = funcionalidad;

    this.formFuncionalidad.controls['id'].setValue(this.funcionalidadSeleccionada.id);
    this.formFuncionalidad.controls['descripcion'].setValue(this.funcionalidadSeleccionada.descripcion);
    this.formFuncionalidad.controls['aprobado'].setValue(this.funcionalidadSeleccionada.aprobado);
    this.formFuncionalidad.controls['cambio_solicitado'].setValue(this.funcionalidadSeleccionada.cambio_solicitado);

  }

  cancelarEdicion(): void {
    this.funcionalidadSeleccionada = null;
    this.formFuncionalidad.controls['id'].setValue(null);
    this.formFuncionalidad.controls['descripcion'].setValue(null);
    this.formFuncionalidad.controls['aprobado'].setValue(null);
    this.formFuncionalidad.controls['cambio_solicitado'].setValue(null);
  }

}
