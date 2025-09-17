import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { jwtDecode } from 'jwt-decode';
import { ProyectoService } from '../../../../../services/proyecto.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-eliminar-proyecto',
  imports: [
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './eliminar-proyecto.component.html',
  styleUrl: './eliminar-proyecto.component.css'
})
export class EliminarProyectoComponent {

  constructor(
    private proyectoService: ProyectoService,
    private toastService: HotToastService
  ) {}

  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<EliminarProyectoComponent>)

  eliminarProyecto(): void {

    const token = localStorage.getItem('token');
    if(!token) return
    const decoded:any = jwtDecode(token);

    const proyectoEliminado = {
      id: this.data.id,
      nombre_proyecto: this.data.nombre,
      id_usuario: decoded.id
    }

    console.log(proyectoEliminado)

    this.proyectoService.eliminarProyecto(proyectoEliminado).subscribe({
      next: ()=>{
        this.cerrarModal(true);
      },
      error: e => {
        this.toastService.error(e.error.error, {
          position: 'top-right',
          duration: 3000
        })
      }
    })

  }

  cerrarModal(flag: boolean):void {
    this.dialogRef.close(flag);
  }


}
