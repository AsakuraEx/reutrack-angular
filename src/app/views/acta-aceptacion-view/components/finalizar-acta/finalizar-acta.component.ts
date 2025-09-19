import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActaAceptacionService } from '../../../../services/acta-aceptacion.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-finalizar-acta',
  imports: [
    MatIconModule, MatButtonModule
  ],
  templateUrl: './finalizar-acta.component.html',
  styleUrl: './finalizar-acta.component.css'
})
export class FinalizarActaComponent {

  constructor(
    private actaAceptacionService: ActaAceptacionService,
    private toastService: HotToastService
  ){}

  readonly dialogRef = inject(MatDialogRef<FinalizarActaComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  cerrarModal(flag: boolean): void {
    this.dialogRef.close(flag);
  }

  finalizarActaAceptacion(): void {

    console.log(this.data)

    this.actaAceptacionService.finalizarActaAceptacion(this.data.id_acta).subscribe({
      next: () => {
        this.toastService.success('Se finalizó el acta de aceptación', {
          duration: 3000,
          position: 'top-right'
        });
        this.cerrarModal(true);
      },
      error: e => {
        console.error(e);
      }
    })

  }

}
