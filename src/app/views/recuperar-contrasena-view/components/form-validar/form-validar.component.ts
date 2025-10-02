import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../services/auth-service.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-validar',
  imports: [
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  templateUrl: './form-validar.component.html',
  styleUrl: './form-validar.component.css'
})
export class FormValidarComponent {

  constructor(
    private authService: AuthService,
    private toastService: HotToastService,
    private router: Router
  ) {}

  @Input() email!: string;
  isSubmitting: boolean = false;

  formValidar = new FormGroup({
    codigo: new FormControl<string>('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
    email: new FormControl<string>(this.email ?? '', [Validators.required, Validators.email])
  })

  onSubmit(): void {

    this.isSubmitting = true;
    this.formValidar.controls['email'].setValue(this.email);
    const email = this.formValidar.controls['email'].value ?? '';
    const codigo = this.formValidar.controls['codigo'].value ?? '';
    
    if(this.formValidar.valid){

      this.authService.verificarCodigoRecuperacion(email, codigo).subscribe({
        next: res => {
          console.log("Exito")
          console.log(res)
          this.toastService.success('La validación se realizó exitosamente', { duration: 3000, position: 'top-right' });
          localStorage.setItem('token-recuperacion', res.token)
          this.isSubmitting = false;
          this.router.navigate(['/actualizar-contrasena'])
        },
        error: err => {
          console.log(err)
          this.toastService.error(err.error.message, { duration: 3000, position: 'top-right' });
          this.isSubmitting = false;
        }
      });

    } else {

      console.log("Formulario no valido");
      this.isSubmitting = false;

    }

  }
}
