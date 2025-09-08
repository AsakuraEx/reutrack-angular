import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ReunionService } from '../../services/reunion.service';

@Component({
  selector: 'app-cancelar-reunion-modal',
  imports: [
    MatIconModule, MatButtonModule
  ],
  templateUrl: './cancelar-reunion-modal.component.html',
  styleUrl: './cancelar-reunion-modal.component.css'
})
export class CancelarReunionModalComponent {

  constructor(
    private reunionService: ReunionService
  ) {}

  readonly dialogRef = inject(MatDialogRef<CancelarReunionModalComponent>)
  readonly data = inject(MAT_DIALOG_DATA)


  cancelarReunion(): void {
    console.log(this.data)
    this.reunionService.cancelarReunion(this.data.id).subscribe({
      next: ()=>{
        this.cerrarModal(true)
      },
      error: e => {
        console.error(e.message)
      }
    })
  }

  cerrarModal(flag: boolean): void{

    this.dialogRef.close(flag);

  }

}
