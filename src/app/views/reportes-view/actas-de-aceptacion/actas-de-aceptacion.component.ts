import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormFiltroComponent } from './components/form-filtro/form-filtro.component';
import { TablaActasComponent } from "./components/tabla-actas/tabla-actas.component";

@Component({
  selector: 'app-actas-de-aceptacion',
  imports: [
    FormFiltroComponent, MatIconModule, TablaActasComponent
],
  templateUrl: './actas-de-aceptacion.component.html',
  styleUrl: './actas-de-aceptacion.component.css'
})
export class ActasDeAceptacionComponent {

  ActasDeAceptacion!: any[];

  obtenerActasDeAceptacion(event: any) {
    this.ActasDeAceptacion = event;
  }

}
