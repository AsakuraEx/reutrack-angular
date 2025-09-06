import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
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

  formProyectos = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    id_usuario: new FormControl<number|null>(null, [Validators.required])
  })

  cerrarModal(flag:boolean): void {
    this.dialogRef.close(flag)
  }

  onSubmit():void {

    this.isSubmitting = true

    if(this.formProyectos.controls['nombre'].valid){
      const token = localStorage.getItem('token')
      if(!token){
        this.isSubmitting = false;
        return
      }
      const decoded: any = jwtDecode(token)
      this.formProyectos.controls['id_usuario'].setValue(decoded.id)
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
    }

  }
}
