import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActaAceptacionService } from '../../../../services/acta-aceptacion.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-funcionalidades',
  imports: [
    MatButtonModule, MatIconModule, MatTooltipModule, MatSlideToggleModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule
  ],
  templateUrl: './lista-funcionalidades.component.html',
  styleUrl: './lista-funcionalidades.component.css'
})
export class ListaFuncionalidadesComponent {

  @Input() funcionalidades: any[] = [];
  @Output() actualizarTabla = new EventEmitter<void>
  @Output() funcionalidadSeleccionada = new EventEmitter<any>();

  constructor(
    private actaAceptacionService: ActaAceptacionService
  ) {}

  @Input() acta_aceptacion!: any;

  aprobarFuncionalidad(id_funcionalidad: number): void {

    this.actaAceptacionService.aprobarFunciones(id_funcionalidad).subscribe( () => {
      this.actualizarTabla.emit();
    })

  }

  eliminarFuncionalidad(id_funcionalidad: number): void {
    this.actaAceptacionService.eliminarFunciones(id_funcionalidad).subscribe(()=>{
      this.actualizarTabla.emit();
    })
  }

  seleccionarFuncionalidad(funcionalidad: any): void {
    this.funcionalidadSeleccionada.emit(funcionalidad);
  }

  revertirAprobacion(id_funcionalidad: number): void {
    const data = {
      aprobado: false,
      id: id_funcionalidad
    };

    this.actaAceptacionService.editarFunciones(data).subscribe({
      next: () => {
        this.actualizarTabla.emit();
      },
      error: err => {
        console.error('Error al desaprobar la funcionalidad:', err);
      }
    })
  }

}
