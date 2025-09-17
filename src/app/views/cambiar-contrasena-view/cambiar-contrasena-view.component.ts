import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { passwordMatchValidator } from '../../config/Validators';
import { jwtDecode } from 'jwt-decode';
import { UsuarioService } from '../../services/usuario.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { AuthService } from '../../services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-contrasena-view',
  imports: [
    MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, ReactiveFormsModule
  ],
  templateUrl: './cambiar-contrasena-view.component.html',
  styleUrl: './cambiar-contrasena-view.component.css'
})
export class CambiarContrasenaViewComponent {

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private toastService: HotToastService,
    private router: Router
  ){}

  formContrasena = new FormGroup({
    id_usuario: new FormControl(null, [Validators.required]),
    old: new FormControl('', {
      validators:[Validators.required],
    }),
    new: new FormControl('', {
      validators: [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-{}\[\]:;<>,.?/~]).{8,}$/)], 
      updateOn: 'blur'
    }),
    new2: new FormControl('', {
      validators: [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-{}\[\]:;<>,.?/~]).{8,}$/)],
      updateOn: 'blur'
    }),
    sesion: new FormControl(2, [Validators.required])
  }, { validators: passwordMatchValidator});

  hideOld = signal(true);
  hideNew = signal(true);
  hideNew2 = signal(true);

  toggle(control: 'old' | 'new' | 'new2', event: MouseEvent) {
    event.stopPropagation();
    switch (control) {
      case 'old':
        this.hideOld.set(!this.hideOld());
        break;
      case 'new':
        this.hideNew.set(!this.hideNew());
        break;
      case 'new2':
        this.hideNew2.set(!this.hideNew2());
        break;
    }
  }

  cambiarContrasena(data: any): void {
    this.usuarioService.actualizarContraseña(data).subscribe({
      next: response =>{
        console.log(response)
        this.toastService.success('La contraseña se ha actualizado, por favor ingresa sesión nuevamente.', {
          duration: 5000,
          position: 'top-right'
        })
        this.cerrarSesion(data.id_usuario)
      },
      error: e => {
        this.toastService.error(e.error, {
          duration: 5000,
          position: 'top-right'
        })
      }
    })
  }

  cerrarSesion(id_usuario: number): void {
    
   this.authService.cerrarSesion(id_usuario).subscribe({
    next: () => {
      localStorage.clear();
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.log(err)
    }
   })
  }

  onSubmit(): void {

    const token = localStorage.getItem('token')
    if(!token){
      return
    }

    const decoded: any = jwtDecode(token)
    this.formContrasena.controls['id_usuario'].setValue(decoded.id);
    this.formContrasena.controls['sesion'].setValue(decoded.first_session);

    if(this.formContrasena.valid){
      this.cambiarContrasena(this.formContrasena.value);
    }

  }

}
