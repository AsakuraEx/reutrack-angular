import { Component, inject } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { jwtDecode } from 'jwt-decode';
import { ReunionService } from '../../services/reunion.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-reactivar-reunion-modal',
  imports: [
    MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    FormsModule, ReactiveFormsModule
],
  templateUrl: './reactivar-reunion-modal.component.html',
  styleUrl: './reactivar-reunion-modal.component.css'
})
export class ReactivarReunionModalComponent {

  constructor(
    private reunionService: ReunionService,
    private toastService: HotToastService
  ){}

  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ReactivarReunionModalComponent>)

  formReactivar = new FormGroup({
    justificacion: new FormControl<string>('', [Validators.required, Validators.minLength(20)]),
    id_usuario: new FormControl<number|null>(null, [Validators.required]),
    id: new FormControl<number|null>(null, [Validators.required])
  })

  cerrarModal(flag:boolean): void {
    this.dialogRef.close(flag);
  }

  reactivarReunion(): void {

    const token = localStorage.getItem('token');

    if(!token) {
      return;
    }

    const decoded: any = jwtDecode(token)
    
    this.formReactivar.controls['id'].setValue(this.data.id);
    this.formReactivar.controls['id_usuario'].setValue(decoded.id)

    console.log(this.formReactivar.value)

    this.reunionService.reactivarReunion(this.formReactivar.value).subscribe({
      next: () => {
        this.cerrarModal(true);
      },
      error: e => {
        console.error(e)
      }
    })
  }

}
