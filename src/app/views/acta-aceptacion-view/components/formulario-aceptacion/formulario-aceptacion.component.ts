import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { ActaAceptacionService } from '../../../../services/acta-aceptacion.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-formulario-aceptacion',
  imports: [
    MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule
  ],
  templateUrl: './formulario-aceptacion.component.html',
  styleUrl: './formulario-aceptacion.component.css'
})
export class FormularioAceptacionComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private actaAceptacionService: ActaAceptacionService,
    private toastService: HotToastService
  ){}

  formAceptacion = new FormGroup({
    id_acta: new FormControl<number|null>(null, [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    institucion: new FormControl('', [Validators.required]),
    cargo: new FormControl('', [Validators.required]),
    documento: new FormControl('', [Validators.required]),
    documento_identidad: new FormControl<File|null>(null),
    documento_institucional: new FormControl<File|null>(null)
  })

  identidadPreview: string | null = null;

  institucionPreview: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (file && file.type.startsWith('image/')) {

      this.formAceptacion.patchValue({ 'documento_identidad' :file })

      const reader = new FileReader();
      reader.onload = () => {
        this.identidadPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.formAceptacion.controls['documento_identidad'].setValue(file)
    } else {
      this.identidadPreview = null;
      console.warn('El archivo seleccionado no es una imagen válida');
    }

  }

  onFileSelected2(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.institucionPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.formAceptacion.controls['documento_institucional'].setValue(file)
    } else {
      this.institucionPreview = null;
      console.warn('El archivo seleccionado no es una imagen válida');
    }

  }

  onSubmit(): void {
    const id_acta:number = Number(this.route.snapshot.paramMap.get('id_acta'));
    this.formAceptacion.controls['id_acta'].setValue(id_acta)

    if(this.formAceptacion.valid) {

      // Convertir el formulario en FormData
      const formData = new FormData();
      formData.append('id_acta', String(this.formAceptacion.get('id_acta')?.value ?? ''));
      formData.append('nombre', this.formAceptacion.get('nombre')?.value!);
      formData.append('institucion', this.formAceptacion.get('institucion')?.value!);
      formData.append('cargo', this.formAceptacion.get('cargo')?.value!);
      formData.append('documento', this.formAceptacion.get('documento')?.value!);
  
      const identidadFile = this.formAceptacion.get('documento_identidad')?.value;
      if (identidadFile) {
        formData.append('documento_identidad', identidadFile);
      }
  
      const institucionFile = this.formAceptacion.get('documento_institucional')?.value;
      if (institucionFile) {
        formData.append('documento_institucional', institucionFile);
      }
  
      this.actaAceptacionService.agregarUsuarioActa(formData).subscribe({
        next: () => {
          this.toastService.success("Muchas gracias por el apoyo, se agregó satisfactoriamente sus datos al acta de aceptación", {
            position: 'top-right',
            duration: 3000
          })
          this.router.navigate(['/login'])
        },
        error: e => {
          this.toastService.error("No pudo enviarse el formulario, ocurrio un error", {
            position: 'top-right',
            duration: 3000
          })
        }
      })
    
    }
  }


}
