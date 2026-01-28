import { Component, inject } from '@angular/core';
import { ProyectoService } from '../../../../../services/proyecto.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-fusion-modal',
  imports: [
    MatIconModule
  ],
  templateUrl: './fusion-modal.component.html',
  styleUrl: './fusion-modal.component.css'
})
export class FusionModalComponent {

  constructor(
    private proyectoService: ProyectoService
  ){}

  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<FusionModalComponent>);

  onConfirm(): void {
      this.proyectoService.fusionarProyectos(this.data.form).subscribe({
        next: () => {
          this.data.event.emit([]);
          this.dialogRef.close(true);
        },
        error: err => {
          console.error(err);

        }
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
