import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActaAceptacionService } from '../../../../services/acta-aceptacion.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-crear-acta-aceptacion',
  imports: [
    MatIconModule, MatButtonModule
  ],
  templateUrl: './crear-acta-aceptacion.component.html',
  styleUrl: './crear-acta-aceptacion.component.css'
})
export class CrearActaAceptacionComponent {

  constructor(
    private router: Router,
    private toastService: HotToastService,
    private actaAceptacionService: ActaAceptacionService,
  ) {}

  readonly data = inject(MAT_DIALOG_DATA)
  readonly dialogRef = inject(MatDialogRef<CrearActaAceptacionComponent>)

  cerrarModal(): void {
    this.dialogRef.close()
  }

  crearActaAceptacion(): void {

    this.actaAceptacionService.crearActaAceptacion(this.data).subscribe({
      next: res =>{
        this.toastService.success('Se creó satisfactoriamente el acta de aceptación', {
          position: 'top-right',
          duration: 3000
        });
        this.cerrarModal();
        this.router.navigate(['/versiones/acta-aceptacion/' + res.id])
      },
      error: e => {
        this.toastService.error(e, {
          position: 'top-right',
          duration: 3000
        });
      }
    })

  }

}
