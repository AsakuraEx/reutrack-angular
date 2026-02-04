import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ProyectoService } from '../../../../services/proyecto.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-actualizar-modal',
  imports: [
    MatButtonModule, MatSelectModule, ReactiveFormsModule
  ],
  templateUrl: './actualizar-modal.component.html',
  styleUrl: './actualizar-modal.component.css'
})
export class ActualizarModalComponent implements OnInit{

  readonly dialogRef = inject(MatDialogRef<ActualizarModalComponent>)

  readonly data = inject(MAT_DIALOG_DATA);

  estados: any[] = [];
  ctl_estado_version!: number;
  actualizarEstado: boolean = false;

  formVersion = new FormGroup({
    id_estado_req: new FormControl<number>(0, [Validators.required]),
    id: new FormControl<number>(0),
    id_proyecto: new FormControl<number>(0),
    updatedby: new FormControl<number>(0),
  })

  constructor(private proyectoService: ProyectoService) {}

  ngOnInit(): void {
    this.obtenerEstados() 
  }

  onSubmit(): void {

    const token = localStorage.getItem('token');
    
    if(!token) return;

    const decoded: any = jwtDecode(token);

    this.formVersion.controls['id'].setValue(this.data.id)
    this.formVersion.controls['updatedby'].setValue(decoded.id)
    this.formVersion.controls['id_proyecto'].setValue(this.data.id_proyecto)
    this.proyectoService.actualizarVersion(this.formVersion.value).subscribe({
      next: () => {
        this.closeModal(true)
      },
      error: err => {
        console.log(err)
      }
    })
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

  showActualizarEstado() :void {
    this.actualizarEstado = !this.actualizarEstado;
  }

  closeModal(flag: boolean) :void {
    this.dialogRef.close(flag);
  }

}
