import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ReunionCodeComponent } from "../reunion-code/reunion-code.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth-service.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-form',
  imports: [
    MatButtonModule, MatInputModule, MatFormFieldModule, MatDividerModule, ReunionCodeComponent,
    ReactiveFormsModule, MatProgressSpinnerModule, MatProgressBarModule, MatIconModule, RouterLink
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {

  // validacion envía si el login fue exitoso o no
  @Output() validacion = new EventEmitter<boolean>;

  errorMessage!: string;

  // Es una variable de control del login, para mostrar un spinner en caso que se tarde el proceso
  isSubmitting:boolean = false;

  // Esta variable define el formulario como un objeto con sus valores por defecto y sus validaciones
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  // Se inyecta el servicio para ser utilizado
  constructor(
    private authService: AuthService,
    private toastService: HotToastService
  ){}

  // Metodo de envío del formulario
  onSubmit(): void {
    this.isSubmitting = true;

    if (this.loginForm.invalid) {
      // Marca todos los controles como tocados para que muestren errores
      this.loginForm.markAllAsTouched();
      this.isSubmitting = false;
      return;
    }

    // Almaceno los valores del formulario den variables nuevas
    const email = this.loginForm.controls['email'].value;
    const password = this.loginForm.controls['password'].value

    if(email && password){
      // Ejecuto el metodo del endpoint
      this.authService.iniciarSesion(email, password).subscribe({
        next: (response) => {

          if(!response.error){
            
            this.toastService.success("Revisa la bandeja de entrada de tu correo electrónico", {
              duration: 3000,
              position: 'top-right'
            })
            this.validacion.emit(true);
            sessionStorage.setItem('email', email)

          }else{

            this.errorMessage = response.error;
            this.toastService.error(this.errorMessage, {
              duration: 3000,
              position: 'top-right'
            })
          
          }
        },
        error: (error) => {
          console.error('Ocurrio un error inesperado: ' + error)
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
          this.resetForm()
        }
      })
    }

  }

  resetForm(): void {
    // Se reinicia el formulario completamente
    this.loginForm.reset();  
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
    this.loginForm.updateValueAndValidity();
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

}
