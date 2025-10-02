import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth-service.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormValidarComponent } from '../form-validar/form-validar.component';

@Component({
  selector: 'app-form-recuperar',
  imports: [
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, 
    RouterLink, ReactiveFormsModule, MatProgressSpinnerModule, FormValidarComponent
  ],
  templateUrl: './form-recuperar.component.html',
  styleUrl: './form-recuperar.component.css'
})
export class FormRecuperarComponent {

  constructor(
    private authService: AuthService,
    private toastService: HotToastService
  ) {}

  isSubmitting:boolean = false;
  emailUtilizado: string = '';
  codigoRecibido: boolean = false;

  formRecuperar = new FormGroup({
    email: new FormControl<string>('', {
      updateOn: 'blur',
      validators: [Validators.email, Validators.required]
    })
  })

  onSubmit(): void {

    this.isSubmitting = true;

    if(this.formRecuperar.valid){
      if(this.formRecuperar.controls['email'].value){
        this.authService.enviarCodigoRecuperacion(this.formRecuperar.controls['email'].value).subscribe({
          next: res => {
            this.emailUtilizado = this.formRecuperar.controls['email'].value ?? '';
            this.toastService.success(res.exito, { duration: 3000, position: 'top-right' });
            this.isSubmitting = false;
            this.codigoRecibido = true;
          },
          error: err => {
            console.log(err)
            this.toastService.error(err.error.error, { duration: 3000, position: 'top-right' });
            this.isSubmitting = false;
          }
        });
      }

    }

  }

}
