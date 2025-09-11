import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { jwtDecode } from 'jwt-decode';
import { ProyectoService } from '../../../../services/proyecto.service';

@Component({
  selector: 'app-agregar-version-form',
  imports: [
    ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule
  ],
  templateUrl: './agregar-version-form.component.html',
  styleUrl: './agregar-version-form.component.css'
})
export class AgregarVersionFormComponent {

  constructor(
    private proyectoService: ProyectoService
  ) {}

  readonly dialogRef = inject(MatDialogRef<AgregarVersionFormComponent>);
  readonly data = inject(MAT_DIALOG_DATA)

  formVersion = new FormGroup({
    id: new FormControl<number|null>(this.data?.id ?? null),
    nombre: new FormControl(this.data?.nombre ?? '', [Validators.required, Validators.maxLength(200)]),
    descripcion: new FormControl(this.data?.descripcion ?? '', [Validators.maxLength(250)]),
    id_proyecto: new FormControl<number|null>(this.data?.proyecto?.id ?? null),
    id_usuario: new FormControl<number|null>(this.data?.usuario?.id ?? null),
    id_estado: new FormControl<number>(this.data?.estado?.id ?? 1, [Validators.required])
  })

  onSubmit(): void {

    if(!this.data.id){

      const token = localStorage.getItem('token');
      if(!token) return;
  
      const decoded:any = jwtDecode(token);

      this.formVersion.controls['id_proyecto'].setValue(this.data)
      this.formVersion.controls['id_usuario'].setValue(decoded.id)

      if(this.formVersion.valid){
        this.proyectoService.crearVersion(this.formVersion.value).subscribe({
          next: () => {
            this.cerrarModal(true)
          },
          error: e => {
            console.error(e)
          }
        })
      }

    } else {

      this.proyectoService.actualizarVersion(this.formVersion.value).subscribe({
        next: () => {
          this.cerrarModal(true)
        },
        error: e => {
          console.error(e)
        }
      })

    }
  }

  cerrarModal(flag: boolean): void {
    this.dialogRef.close(flag)
  }

}
