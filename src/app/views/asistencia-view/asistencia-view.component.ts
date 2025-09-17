import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReunionService } from '../../services/reunion.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-asistencia-view',
  imports: [
    MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, RouterLink, ReactiveFormsModule, MatSlideToggleModule
  ],
  templateUrl: './asistencia-view.component.html',
  styleUrl: './asistencia-view.component.css'
})
export class AsistenciaViewComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reunionService: ReunionService,
    private toastService: HotToastService
  ){}

  codigo!:string;
  reunion!:any;
  participante_extranjero = new FormControl(false);

  formAsistencia = new FormGroup({
    participante: new FormControl('', [Validators.required,Validators.maxLength(200)]),
    institucion: new FormControl('', [Validators.required,Validators.maxLength(200)]),
    cargo: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    doc_identidad: new FormControl('', [Validators.required,Validators.maxLength(20)]),
    telefono: new FormControl('', [Validators.required,Validators.maxLength(9)]),
    correo: new FormControl('', [Validators.required,Validators.maxLength(100), Validators.email]),
    id_reunion: new FormControl(null, [Validators.required])
  })

  ngOnInit(): void {
    this.codigo = String(this.route.snapshot.paramMap.get('codigo_reunion'))
    this.ObtenerReunion();
  }

  ObtenerReunion(): void {
    this.reunionService.obtenerReunionPorCodigo(this.codigo).subscribe({
      next: res => this.reunion = res,
      error: e => console.error(e)
    })
  }

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

  onSubmit() :void {

    this.formAsistencia.controls['id_reunion'].setValue(this.reunion.id)

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
          this.toastService.success('Se registro su participacion en la lista de asistencia.', {
            duration: 3000,
            position: 'top-right'
          })

          this.router.navigate(['/login'])
        },
        error: err => {
          console.error("Ocurrio un error: ", err)
        }
      })
    }
  }



}
