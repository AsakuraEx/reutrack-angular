import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';

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

  ngOnInit() {
    console.log(this.reunion)
  }

  maxDate!: Date;
  minDate!: Date;

  @Input() reunion!:any;

  @Output() verLista = new EventEmitter<boolean>;

  reprogramarForm = new FormGroup({
    fecha: new FormControl(),
    hora: new FormControl(),
    id_usuario: new FormControl()
  })

  regresarLista(): void {
    this.verLista.emit(false);
  }

}
