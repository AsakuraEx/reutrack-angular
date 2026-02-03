import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { jwtDecode } from 'jwt-decode';
import { ReunionService } from '../../../../services/reunion.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ListaEventosModalComponent } from '../lista-eventos-modal/lista-eventos-modal.component';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-reprogramacion',
  imports: [
    MatIconModule, MatFormFieldModule, MatDatepickerModule, MatTimepickerModule, MatButtonModule, ReactiveFormsModule, MatInputModule
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reprogramacion.component.html',
  styleUrl: './reprogramacion.component.css'
})
export class ReprogramacionComponent implements OnInit {

  constructor(
    private reunionService: ReunionService,
    private toastService: HotToastService
  ){}

  dialogRef = inject(MatDialogRef<ListaEventosModalComponent>);

  maxDate!: Date;
  minDate!: Date;

  @Input() reunion!:any;

  @Output() verLista = new EventEmitter<boolean>;

  reprogramarForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    fecha: new FormControl<Date | null>(null, [Validators.required]),
    hora: new FormControl<Date | null>(null, [Validators.required]),
    fecha_reprogramada: new FormControl<Date|null>(null),
    id_usuario: new FormControl('', [Validators.required])
  })

  ngOnInit() {
    //Validando entrada del DatePicker
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.minDate.getFullYear() + 2);
  }


  regresarLista(): void {
    this.verLista.emit(false);
  }

  generarFechaReprogramada(): void {

    const f = this.reprogramarForm.controls['fecha'].value;
    const h = this.reprogramarForm.controls['hora'].value;

    if(!f || !h) {
      console.error('Ocurrió un error al manejar la fecha y hora');
      return;
    }
    const fechaFinal = new Date(f.getFullYear(), f.getMonth(), f.getDate(), h.getHours(), h.getMinutes());
    this.reprogramarForm.controls['fecha_reprogramada'].setValue(fechaFinal);

  }

  onSubmit(): void {

    const token = localStorage.getItem('token');

    if(!token) return;

    const decoded:any = jwtDecode(token);

    this.reprogramarForm.controls['id'].setValue(this.reunion.id);
    this.reprogramarForm.controls['id_usuario'].setValue(decoded.id);

    this.generarFechaReprogramada();

    if(this.reprogramarForm.valid){
      
      this.reunionService.reprogramarReunion(this.reprogramarForm.value).subscribe({
        next: ()=>{
          this.toastService.success('La reprogramación se realizó exitosamente', {
            duration: 3000,
            position: 'top-right'
          })
          this.dialogRef.close(true)
        },
        error: error => {
          console.error(error)
        }
      })

    }
  }

}
