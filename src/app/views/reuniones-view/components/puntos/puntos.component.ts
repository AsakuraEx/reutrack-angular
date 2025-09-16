import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { ReunionService } from '../../../../services/reunion.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';



@Component({
  selector: 'app-puntos',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule, ReactiveFormsModule],
  templateUrl: './puntos.component.html',
  styleUrl: './puntos.component.css'
})
export class PuntosComponent implements OnInit{

  constructor(
    private reunionService: ReunionService,
    private toastService: HotToastService
  ){}

  @Input() id_reunion!: number;
  expandirPanel = false;
  dataSource: any[] = [];

  puntosForm = new FormGroup({
    id_reunion: new FormControl<number | null>(null, [Validators.required, Validators.maxLength(256)]),
    nombre: new FormControl('', [Validators.required]) 
  })

  ngOnInit(): void {
    this.obtenerPuntosDeReunion()
  }

  expandirAcuerdos(): void {
    this.expandirPanel = !this.expandirPanel
  }

  obtenerPuntosDeReunion(): void {

    this.reunionService.consultarPuntos(this.id_reunion).subscribe({
      next: response => {
        this.dataSource = response;
      },
      error: err => {
        console.error(err)
      }
    })

  }

  agregarPuntoReunion(): void {

    this.puntosForm.controls['id_reunion'].setValue(this.id_reunion);

    if(this.puntosForm.invalid){
      this.toastService.info('El campo punto de la reunión es requerido', {
        duration: 2000,
        position: 'top-right'
      })
      return
    }

    if(this.puntosForm.valid){
      this.reunionService.agregarPuntos(this.puntosForm.value).subscribe({
        next: ()=>{
          this.obtenerPuntosDeReunion();
          this.toastService.success('El punto de la reunión se agregó correctamente', {
            duration: 2000,
            position: 'top-right'
          })
          this.puntosForm.markAsPristine();
          this.puntosForm.markAsUntouched();
          this.puntosForm.reset()
        },
        error: err => {
          console.error(err)
        }
      })
    }
  }

  eliminarPuntoReunion(id:number): void {

    this.reunionService.eliminarPunto(id).subscribe({
      next: ()=>{
        this.obtenerPuntosDeReunion()
      },
      error: err => {
        console.error(err)
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
