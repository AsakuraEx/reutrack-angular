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
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-asistencia-view',
  imports: [
    MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, RouterLink, ReactiveFormsModule, MatSlideToggleModule, NgxMaskDirective
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
    participante: new FormControl('', [
      Validators.required,
      Validators.maxLength(200), 
      Validators.minLength(3)
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
    id_reunion: new FormControl(null, [
      Validators.required
    ])
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

  onSubmit() :void {

    this.formAsistencia.controls['id_reunion'].setValue(this.reunion.id)

    if(this.formAsistencia.invalid) {
      this.formAsistencia.markAllAsTouched();
      return; // corta ejecución si es inválido
    }

    const regexValidator: RegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+(?:\s[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/;

    const participante: string = this.formAsistencia.controls['participante'].value?.trim() || '';

    if(participante === '') {
      this.toastService.error('El campo "Participante" no puede estar vacío.', {
        duration: 3000,
        position: 'top-right'
      });
      return;
    }

    if(!regexValidator.test(participante)){
      this.toastService.error('El campo "Participante" solo puede contener letras y espacios.', {
        duration: 3000,
        position: 'top-right'
      });
      return;
    }

    if(this.formAsistencia.valid){
      this.reunionService.agregarParticipante(this.formAsistencia.value).subscribe({
        next: response => {
          this.toastService.success('Se registró su participación en la lista de asistencia.', {
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
