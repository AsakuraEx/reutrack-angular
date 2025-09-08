import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { jwtDecode } from 'jwt-decode';
import { ProyectoService } from '../../../../../services/proyecto.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-form-proyectos',
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  templateUrl: './form-proyectos.component.html',
  styleUrl: './form-proyectos.component.css'
})
export class FormProyectosComponent {

  constructor(
    private proyectoService: ProyectoService,
    private toastService: HotToastService
  ){}

  readonly dialogRef = inject(MatDialogRef<FormProyectosComponent>)

  isSubmitting:boolean = false;

  data = inject(MAT_DIALOG_DATA);

  formProyectos = new FormGroup({
    id: new FormControl<number|null>(this.data?.id ?? null),
    nombre: new FormControl(this.data?.nombre ??'', [Validators.required, Validators.maxLength(200)]),
    id_usuario: new FormControl<number|null>(this.data?.id_usuario ?? null, [Validators.required])
  })

  cerrarModal(flag:boolean): void {
    this.dialogRef.close(flag)
  }

  onSubmit():void {

    this.isSubmitting = true

    console.log(this.data)

    if(this.formProyectos.controls['nombre'].valid){
      const token = localStorage.getItem('token')
      if(!token){
        this.isSubmitting = false;
        return
      }
      const decoded: any = jwtDecode(token)
      this.formProyectos.controls['id_usuario'].setValue(decoded.id)

      if(!this.data){

        this.proyectoService.crearProyectos(this.formProyectos.value).subscribe({
          next: () => {
            this.toastService.success('Se ha creado el proyecto satisfactoriamente', {
              duration: 3000,
              position: 'top-right'
            })
            this.cerrarModal(true)
          },
          error: (err) => {
            this.toastService.error(err, {
              duration: 3000,
              position: 'top-right'
            })
          }
        })

      }else{

        this.proyectoService.actualizarProyecto(this.formProyectos.value).subscribe({
          next: () => {
            this.toastService.success('El proyecto se actualizó correctamente', {
              duration: 3000,
              position: 'top-right'
            })
            this.cerrarModal(true)
          },
          error: (err) => {
            this.toastService.error(err.message, {
              duration: 3000,
              position: 'top-right'
            })
            console.error(err)
          }    
        })

      }
    }

  }
}
