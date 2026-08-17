import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { ReunionService } from '../../../../services/reunion.service';
import { jwtDecode } from 'jwt-decode';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-cancelar-modal',
  imports: [MatDialogContent, MatIconModule, MatButtonModule],
  templateUrl: './cancelar-modal.component.html',
  styleUrl: './cancelar-modal.component.css'
})
export class CancelarModalComponent {

  constructor(
    private reunionService: ReunionService,
    private toastService: HotToastService
  ) {}

  readonly dialogRef = inject(MatDialogRef<CancelarModalComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  onCancelar(result: boolean = false): void {
    this.dialogRef.close(result);
  }

  onSubmit(id_reunion_compartida: number): void {

    const token = localStorage.getItem('token');
    if(!token) return;
    const decoded: any = jwtDecode(token);

    const data = {
      id: id_reunion_compartida,
      cancelado_por: decoded.id
    }

    this.reunionService.rechazarReunionCompartida(data).subscribe({
      next: response => {
        this.toastService.success(response.msj, {
          position: 'top-right',
          duration: 3000
        })
        return;
      },
      error: err => {
        this.toastService.success(err.error, {
          position: 'top-right',
          duration: 3000
        })
        return;
      }
    })
    this.onCancelar(true)
  }

}
