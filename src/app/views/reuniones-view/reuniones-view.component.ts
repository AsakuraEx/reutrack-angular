import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ReunionService } from '../../services/reunion.service';
import { ReunionHeader } from '../../models/reunion-header.model';
import { ResponsablesComponent } from './components/responsables/responsables.component';
import { ProyectoService } from '../../services/proyecto.service';
import { AsistenciaComponent } from './components/asistencia/asistencia.component';

@Component({
  selector: 'app-reuniones-view',
  imports: [
    MatIconModule, MatButtonModule, ResponsablesComponent, AsistenciaComponent
  ],
  templateUrl: './reuniones-view.component.html',
  styleUrl: './reuniones-view.component.css'
})
export class ReunionesViewComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reunionService: ReunionService,
    private proyectoService: ProyectoService
  ) {}

  expandReunionActualState = false;
  reunionActualDetails!: ReunionHeader;
  version!: any;

  ngOnInit(): void {
   
    this.recuperarReunionActual()

  }

  recuperarReunionActual(): void {
    const codigo = this.route.snapshot.paramMap.get('codigo');

    if(!codigo){
      this.router.navigate(['/']);
      return;
    }

    this.reunionService.obtenerReunionPorCodigo(codigo).subscribe({
      next: (response) => {
        this.reunionActualDetails = response;
        this.obtenerInformacionVersion()
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  expandReunionActual (): void {
    this.expandReunionActualState = !this.expandReunionActualState;
  } 

  obtenerInformacionVersion(): void {
    this.proyectoService.obtenerVersion(this.reunionActualDetails.id_version).subscribe({
      next: (response) => {
        this.version = response
      },
      error: (error) => {
        console.error("NO SIRVE" + error);
      }
    })
  }


}
