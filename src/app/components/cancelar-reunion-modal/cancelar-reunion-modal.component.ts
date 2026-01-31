import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ReunionService } from '../../services/reunion.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-cancelar-reunion-modal',
  imports: [
    MatIconModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule
  ],
  templateUrl: './cancelar-reunion-modal.component.html',
  styleUrl: './cancelar-reunion-modal.component.css'
})
export class CancelarReunionModalComponent {

  constructor(
    private reunionService: ReunionService
  ) {}

  cancelarForm = new FormGroup({
    justificacion: new FormControl('', [Validators.required, Validators.minLength(20)]),
    id_reunion: new FormControl(),
    id_usuario: new FormControl()
  })

  readonly dialogRef = inject(MatDialogRef<CancelarReunionModalComponent>)
  readonly data = inject(MAT_DIALOG_DATA)


  cancelarReunion(): void {

    this.cancelarForm.controls['id_reunion'].setValue(this.data.id);
    
    const token = localStorage.getItem('token');
    if(!token) return;
    const decoded: any = jwtDecode(token);

    this.cancelarForm.controls['id_usuario'].setValue(decoded.id);

    if(this.cancelarForm.valid) {
      this.reunionService.cancelarReunion(this.cancelarForm.value).subscribe({
        next: ()=>{
          this.cerrarModal(true)
        },
        error: e => {
          console.error(e.message)
        }
      })
    }
  }

  cerrarModal(flag: boolean): void{

    this.dialogRef.close(flag);

  }

}
