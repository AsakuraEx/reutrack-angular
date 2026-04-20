import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UsuarioService } from '../../../../services/usuario.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { NgxMaskDirective } from 'ngx-mask';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-agregar-usuarios-form',
  imports: [
    MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, NgxMaskDirective, MatProgressSpinnerModule, MatSelectModule
  ],
  templateUrl: './agregar-usuarios-form.component.html',
  styleUrl: './agregar-usuarios-form.component.css'
})
export class AgregarUsuariosFormComponent {

  constructor(
    private usuarioService: UsuarioService,
    private toastService: HotToastService
  ){}

  ngOnInit(): void {
    this.obtenerCargos();
    console.log(this.data)
  }

  cargos: any[] = [];

  isSubmitting: boolean = false;

  readonly dialogRef = inject(MatDialogRef<AgregarUsuariosFormComponent>)
  readonly data = inject(MAT_DIALOG_DATA)

  formUsuario = new FormGroup({
    id: new FormControl<number|null>(this.data?.id ?? null),
    nombre: new FormControl(this.data?.nombre ?? '', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]+$')]),
    email: new FormControl(this.data?.email ?? '', [Validators.required, Validators.email]),
    cargo: new FormControl(this.data?.cargo?.id ?? 0),
    documento: new FormControl(this.data?.documento ?? '', 
      [
        Validators.required, 
        Validators.pattern('^[0-9]{9}$')
      ]
    ),
    telefono: new FormControl(this.data?.telefono ?? '', 
      [
        Validators.required, 
        Validators.pattern('^[2,6,7]{1}[0-9]{7}$')
      ]
    ),
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
  
        this.isSubmitting = true

        this.usuarioService.crearUsuario(this.formUsuario.value).subscribe({
          next: ()=>{
            this.toastService.success('Usuario creado con exito, se envió las credenciales al correo electrónico proporcionado', {
              position: 'top-right',
              duration: 5000
            })
            this.isSubmitting = false;
            this.cerrarModal(true);
          },
          error: e => {
            this.toastService.error('Error al agregar usuario: ' + e.message, {
              position: 'top-right',
              duration: 3000
            })

            this.isSubmitting = false
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

  obtenerCargos(): void {
    this.usuarioService.obtenerCargos().subscribe({
      next: res => {
        this.cargos = res;
      },
      error: err => {
        console.error('Error al obtener cargos: ', err)
      }
    });  
  }

}
