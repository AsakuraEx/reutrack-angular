import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FusionFormComponent } from './components/fusion-form/fusion-form.component';
import { FusionDetalleComponent } from './components/fusion-detalle/fusion-detalle.component';

@Component({
  selector: 'app-fusionar-proyectos-view',
  imports: [
    MatIconModule, MatButtonModule, RouterLink, FusionFormComponent, FusionDetalleComponent
  ],
  templateUrl: './fusionar-proyectos-view.component.html',
  styleUrl: './fusionar-proyectos-view.component.css'
})
export class FusionarProyectosViewComponent {

  versionesRecibidas: any[] = [];

  recibirVersiones(event: any[]): void {
    this.versionesRecibidas = event
  }

}
