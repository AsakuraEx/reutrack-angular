import { Component, EventEmitter, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AuthService } from '../../../../services/auth-service.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-form',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css'
})
export class AuthFormComponent {

  @Output() cancelarAutenticacion = new EventEmitter<boolean>

  isSubmitting: boolean = false;

  authForm = new FormGroup({
    code: new FormControl('', [Validators.required])
  })

  constructor(
    private authService: AuthService,
    private toastService: HotToastService,
    private router: Router
  ){}

  cancelar(): void {
    this.cancelarAutenticacion.emit(false)
  }

  onSubmit(): void {

    this.isSubmitting = true;
    const email = sessionStorage.getItem('email');
    const code = this.authForm.controls['code'].value

    if(email && code){
      this.authService.verificarDFA(email, code).subscribe({
        next: (response) => {

          if(response.token){

            localStorage.setItem('token', response.token)
            sessionStorage.removeItem('email')
            this.router.navigate(['/'])

          }else{
            this.toastService.error(response.error, {
              duration: 3000,
              position: 'top-right'
            });
          }
          
        },
        error: (error) => {
          console.log(error)
        },
        complete: ()=>{
          this.isSubmitting = false;
          this.resetForm()
        }
      })
    }

  }

  resetForm(): void {
    // Se reinicia el formulario completamente
    this.authForm.reset();  
    this.authForm.markAsPristine();
    this.authForm.markAsUntouched();
    this.authForm.updateValueAndValidity();
  }

}
