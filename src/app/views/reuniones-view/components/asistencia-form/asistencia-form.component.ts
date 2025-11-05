import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReunionService } from '../../../../services/reunion.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { QRCodeComponent } from 'angularx-qrcode';
import { environment } from '../../../../../environments/environment';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-asistencia-form',
  imports: [
    MatSlideToggleModule, ReactiveFormsModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, QRCodeComponent, NgxMaskDirective
  ],
  templateUrl: './asistencia-form.component.html',
  styleUrl: './asistencia-form.component.css',
})
export class AsistenciaFormComponent {

  constructor(
    private reunionService: ReunionService,
    private toastService: HotToastService
  ) {}

  readonly data = inject(MAT_DIALOG_DATA)
  readonly dialogRef = inject(MatDialogRef<AsistenciaFormComponent>)

  readonly urlAsistencia = environment.appURL + '/reunion/asistencia/' + this.data.codigo

  registro_manual = new FormControl(false);
  participante_extranjero = new FormControl(false);

  formAsistencia = new FormGroup({
    participante: new FormControl('', [
      Validators.required,
      Validators.maxLength(200), 
      Validators.minLength(3),
      Validators.pattern('^[a-zA-ZÀ-ÿ]+(?:\\s[a-zA-ZÀ-ÿ]+)*$')
    ]),
    institucion: new FormControl('', [
      Validators.required,
      Validators.maxLength(200),
      Validators.minLength(3),
    ]),
    cargo: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
      Validators.minLength(3)
    ]),
    doc_identidad: new FormControl('', [
      Validators.required,
      Validators.maxLength(9),
      Validators.minLength(9),
      Validators.pattern('^[0-9]{9}$')
    ]),
    telefono: new FormControl('', [
      Validators.required,
      Validators.maxLength(8),
      Validators.minLength(8),
      Validators.pattern('^[2,6,7]{1}[0-9]{7}$')
    ]),
    correo: new FormControl('', [
      Validators.required,
      Validators.maxLength(100), 
      Validators.email
    ]),
    id_reunion: new FormControl(this.data.id, [Validators.required])
  })

  AgregarValidador() :void {

    if(!this.participante_extranjero.value){
      this.formAsistencia.get('doc_identidad')?.setValidators([
        Validators.required,
        Validators.maxLength(9),
        Validators.minLength(9),
        Validators.pattern('^[0-9]{9}$')
      ]);
      this.formAsistencia.get('telefono')?.setValidators([
        Validators.required,
        Validators.maxLength(8),
        Validators.minLength(8),
        Validators.pattern('^[2,6,7]{1}[0-9]{7}$')
      ]);
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
      this.formAsistencia.markAllAsTouched();
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
