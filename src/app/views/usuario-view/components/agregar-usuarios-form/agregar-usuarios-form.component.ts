import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UsuarioService } from '../../../../services/usuario.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-agregar-usuarios-form',
  imports: [
    MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule
  ],
  templateUrl: './agregar-usuarios-form.component.html',
  styleUrl: './agregar-usuarios-form.component.css'
})
export class AgregarUsuariosFormComponent {

  constructor(
    private usuarioService: UsuarioService,
    private toastService: HotToastService
  ){}

  readonly dialogRef = inject(MatDialogRef<AgregarUsuariosFormComponent>)
  readonly data = inject(MAT_DIALOG_DATA)

  formUsuario = new FormGroup({
    id: new FormControl<number|null>(this.data?.id ?? null),
    nombre: new FormControl(this.data?.nombre ?? '', [Validators.required]),
    email: new FormControl(this.data?.email ?? '', [Validators.required, Validators.email]),
    password: new FormControl('')
  })

  generarContrasenaTemporal(): void {
    const letras = "abcdefghijklmnopqrstuvwxyz";
    const numeros = "0123456789";
    const simbolos = "!@#$%^&*()<>?";
    const todos = letras + numeros + simbolos;

    const array = new Uint8Array(8);
    crypto.getRandomValues(array);

    let password = "";
    for (let i = 0; i < 8; i++) {
      password += todos[array[i] % todos.length];
    }

    this.formUsuario.controls['password'].setValue(password);
  }

  cerrarModal(flag: boolean): void {
    this.dialogRef.close(flag);
  }

  onSubmit(): void {

    if(!this.data){
      this.formUsuario.controls['password'].setValidators([Validators.required, Validators.minLength(8)]);
      this.formUsuario.controls['password'].updateValueAndValidity();
      
      if(this.formUsuario.valid){
  
        this.usuarioService.crearUsuario(this.formUsuario.value).subscribe({
          next: ()=>{
            this.toastService.success('Usuario creado con exito', {
              position: 'top-right',
              duration: 3000
            })
            this.cerrarModal(true);
          },
          error: e => {
            console.error(e)
          }
        })
  
      } else {
        this.toastService.error('Debe generar una contraseña temporal para crear al usuario', {
          position: 'top-right',
          duration: 3000
        })
      }

    } else{

      if(this.formUsuario.valid){
  
        this.usuarioService.actualizarUsuario(this.formUsuario.value).subscribe({
          next: ()=>{
            this.toastService.success('Usuario actualizado con exito', {
              position: 'top-right',
              duration: 3000
            })
            this.cerrarModal(true);
          },
          error: e => {
            console.error(e)
          }
        })
  
      }

    }

  }

}
