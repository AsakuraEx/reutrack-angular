import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { ActaAceptacionService } from '../../../../services/acta-aceptacion.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInput, MatInputModule } from '@angular/material/input';
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

  constructor(
    private actaAceptacionService: ActaAceptacionService
  ) {}

  aprobarFuncionalidad(id_funcionalidad: number): void {

    this.actaAceptacionService.aprobarFunciones(id_funcionalidad).subscribe( () => {
      this.actualizarTabla.emit();
    })

  }

}
