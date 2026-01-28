import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { jwtDecode } from 'jwt-decode';
import { ProyectoService } from '../../../../services/proyecto.service';
import { MatSelectModule } from '@angular/material/select';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-agregar-version-form',
  imports: [
    ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSelectModule, MatIconModule
  ],
  templateUrl: './agregar-version-form.component.html',
  styleUrl: './agregar-version-form.component.css'
})
export class AgregarVersionFormComponent implements OnInit{

  constructor(
    private proyectoService: ProyectoService,
    private toastService: HotToastService
  ) {}

  estados: any[] = [];

  readonly dialogRef = inject(MatDialogRef<AgregarVersionFormComponent>);
  readonly data = inject(MAT_DIALOG_DATA)

  formVersion = new FormGroup({
    id: new FormControl<number|null>(this.data?.id ?? null),
    nombre: new FormControl(this.data?.nombre ?? '', [Validators.required, Validators.maxLength(200)]),
    descripcion: new FormControl(this.data?.descripcion ?? '', [Validators.maxLength(250)]),
    id_proyecto: new FormControl<number|null>(this.data?.proyecto?.id ?? null),
    id_usuario: new FormControl<number|null>(this.data?.usuario?.id ?? null),
    id_estado: new FormControl<number>(this.data?.estado?.id ?? 1, [Validators.required]),
    id_estado_req: new FormControl<number | null>(this.data?.id_estado_req ?? null, [Validators.required]),
    updatedby: new FormControl<number>(0, [Validators.required])
  })

  ngOnInit(): void {
      this.obtenerEstados();
  }

  onSubmit(): void {

    const token = localStorage.getItem('token');
    if(!token) return;

    const decoded:any = jwtDecode(token);
    
    if(!this.data.id){

      this.formVersion.controls['id_proyecto'].setValue(this.data)
      this.formVersion.controls['id_usuario'].setValue(decoded.id)
      this.formVersion.controls['updatedby'].setValue(decoded.id)

      if(this.formVersion.valid){
        this.proyectoService.crearVersion(this.formVersion.value).subscribe({
          next: () => {
            this.toastService.success('Versión creada con éxito', {
              position: 'top-right',
              duration: 3000
            });
            this.cerrarModal(true)
          },
          error: e => {
            console.error(e)
            this.toastService.error('La versión no pudo crearse, ' + e, {
              position: 'top-right',
              duration: 3000
            });
          }
        })
      }

    } else {
      this.formVersion.controls['updatedby'].setValue(decoded.id)

      if(this.formVersion.valid){
        this.proyectoService.actualizarVersion(this.formVersion.value).subscribe({
          next: () => {
            this.toastService.success('Versión actualizada con éxito', {
              position: 'top-right',
              duration: 3000
            });
            this.cerrarModal(true)
          },
          error: e => {
            console.error(e)
          }
        })
      }

    }
  }

  cerrarModal(flag: boolean): void {
    this.dialogRef.close(flag)
  }

  obtenerEstados(): void {
    this.proyectoService.obtenerEstadosRequerimiento().subscribe({
      next: response => {
        this.estados = response
      },
      error: err => {
        console.log(err)
      }
    })
  }

}
