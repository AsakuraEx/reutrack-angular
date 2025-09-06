import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { ReunionService } from '../../../../services/reunion.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-acuerdos',
  imports: [
    MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatCardModule,
    FormsModule, ReactiveFormsModule
],
  templateUrl: './acuerdos.component.html',
  styleUrl: './acuerdos.component.css'
})
export class AcuerdosComponent implements OnInit{

  constructor(
    private reunionService: ReunionService,
    private toastService: HotToastService
  ){}

  @Input() id_reunion!: number;
  expandirPanel = false;
  dataSource: any[] = [];
  acuerdoForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.maxLength(256)]),
    id_reunion: new FormControl<number|null>(null, [Validators.required])
  })

  ngOnInit(): void {
      this.obtenerAcuerdosDeReunion()
  }

  expandirAcuerdos(): void {
    this.expandirPanel = !this.expandirPanel
  }

  obtenerAcuerdosDeReunion(): void {
    this.reunionService.consultarAcuerdos(this.id_reunion).subscribe({
      next: response => {
        this.dataSource = response;
      },
      error: err => {
        console.log(err);
      }

    })
  }

  agregarAcuerdoDeReunion(): void {

    this.acuerdoForm.controls['id_reunion'].setValue(this.id_reunion);

    if(this.acuerdoForm.invalid){
      this.toastService.info('El campo acuerdo de reunión es requerido', {
        duration: 2000,
        position: 'top-right'
      })
      return
    }

    if(this.acuerdoForm.valid){

      this.reunionService.agregarAcuerdos(this.acuerdoForm.value).subscribe({
        next: () => {
          this.toastService.success('Se agregó el acuerdo/compromiso correctamente', {
            duration: 2000,
            position: 'top-right'
          })
          this.obtenerAcuerdosDeReunion();
        },
        error: (err) => {
          console.log(err)
        }
      })

    }
    this.acuerdoForm.reset()

  }

  eliminarAcuerdo(id_acuerdo: number): void {
    this.reunionService.eliminarAcuerdo(id_acuerdo).subscribe({
      next: () => {
        this.toastService.success('Se ha eliminado el acuerdo/compromiso satisfactoriamente', {
          duration: 2000,
          position: 'top-right'
        })
        this.obtenerAcuerdosDeReunion();
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  transformarFecha(fecha: string): string  {
      
      const nuevaFecha = new Date(fecha)

      const fechaFormateada = nuevaFecha.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',   // Hora en formato de dos dígitos
          minute: '2-digit', // Minutos en formato de dos dígitos
          second: '2-digit', // Segundos en formato de dos dígitos
          hour12: true
      });

      return fechaFormateada
  }

}
