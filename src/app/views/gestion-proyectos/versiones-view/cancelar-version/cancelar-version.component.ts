import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ProyectoService } from '../../../../services/proyecto.service';

@Component({
  selector: 'app-cancelar-version',
  imports: [
    MatIconModule, MatButtonModule
  ],
  templateUrl: './cancelar-version.component.html',
  styleUrl: './cancelar-version.component.css'
})
export class CancelarVersionComponent {

  constructor(
    private proyectoService: ProyectoService
  ){}

  readonly dialogRef = inject(MatDialogRef<CancelarVersionComponent>)
  readonly data = inject(MAT_DIALOG_DATA);

  cerrarModal(flag:boolean): void {
    this.dialogRef.close(flag)
  }

  cancelarVersion(id_version: number): void {
    
    this.proyectoService.cancelarVersion(id_version).subscribe({
      next: () => {
        this.cerrarModal(true)
      },
      error: e => {
        console.error(e)
      }
    })
  }
}
