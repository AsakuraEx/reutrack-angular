import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReunionService } from '../../../../services/reunion.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-asistencia-form',
  imports: [
    MatSlideToggleModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  templateUrl: './asistencia-form.component.html',
  styleUrl: './asistencia-form.component.css'
})
export class AsistenciaFormComponent {

  constructor(
    private reunionService: ReunionService,
    private toastService: HotToastService
  ) {}

  readonly data = inject(MAT_DIALOG_DATA)
  readonly dialogRef = inject(MatDialogRef<AsistenciaFormComponent>)

  registro_manual = new FormControl(false);
  participante_extranjero = new FormControl(false);

  formAsistencia = new FormGroup({
    participante: new FormControl('', [Validators.required,Validators.maxLength(200)]),
    institucion: new FormControl('', [Validators.required,Validators.maxLength(200)]),
    cargo: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    doc_identidad: new FormControl('', [Validators.required,Validators.maxLength(20)]),
    telefono: new FormControl('', [Validators.required,Validators.maxLength(9)]),
    correo: new FormControl('', [Validators.required,Validators.maxLength(100), Validators.email]),
    id_reunion: new FormControl(this.data.id_reunion, [Validators.required])
  })

  AgregarValidador() :void {

    if(!this.participante_extranjero.value){
      this.formAsistencia.get('doc_identidad')?.setValidators([Validators.required]);
      this.formAsistencia.get('telefono')?.setValidators([Validators.required]);
    }else {
      this.formAsistencia.get('doc_identidad')?.clearValidators()
      this.formAsistencia.get('telefono')?.clearValidators()
    }

    this.formAsistencia.get('doc_identidad')?.updateValueAndValidity();
    this.formAsistencia.get('telefono')?.updateValueAndValidity();

  }


  cerrarModal(flag: boolean): void {
    this.dialogRef.close(flag)
  }


  onSubmit() :void {

    if(this.formAsistencia.invalid) {

    // Marca todos los campos como "tocados" para que se activen los errores
      Object.keys(this.formAsistencia.controls).forEach(field => {
        const control = this.formAsistencia.get(field);
        control?.markAsTouched({ onlySelf: true });
      });

      // Recolecta mensajes de error
      let mensajes: string[] = [];

      Object.keys(this.formAsistencia.controls).forEach(field => {
        const control = this.formAsistencia.get(field);

        if (control?.errors) {
          if (control.errors['required']) {
            mensajes.push(`${field === 'doc_identidad' ? 'Número de DUI': field} es requerido`);
          }
          if (control.errors['maxlength']) {
            mensajes.push(`${field === 'doc_identidad' ? 'Número de DUI': field} excede el máximo de caracteres (${control.errors['maxlength'].requiredLength})`);
          }
          if (control.errors['email']) {
            mensajes.push(`${field === 'doc_identidad' ? 'Número de DUI': field} no es un correo válido`);
          }
        }
      });

      // Muestra cada error en el toast (uno por campo)
      mensajes.forEach(msg => {
        this.toastService.error(msg, {
          duration: 3000,
          position: 'top-right'
        });
      });

      return; // corta ejecución si es inválido

    }

    if(this.formAsistencia.valid){
      this.reunionService.agregarParticipante(this.formAsistencia.value).subscribe({
        next: response => {
          this.toastService.success('Se agregó al participante a la lista de asistencia.', {
            duration: 3000,
            position: 'top-right'
          })

          this.cerrarModal(true);
        },
        error: err => {
          console.error("Ocurrio un error: ", err)
        }
      })
    }
  }


}
