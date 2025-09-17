import { Component, OnInit } from '@angular/core';
import { ActaAceptacionService } from '../../services/acta-aceptacion.service';
import { ActivatedRoute } from '@angular/router';
import { FuncionalidadesComponent } from './components/funcionalidades/funcionalidades.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

@Component({
  selector: 'app-acta-aceptacion-view',
  imports: [
    FuncionalidadesComponent, UsuariosComponent
  ],
  templateUrl: './acta-aceptacion-view.component.html',
  styleUrl: './acta-aceptacion-view.component.css'
})
export class ActaAceptacionViewComponent  implements OnInit{

  constructor(
    private actaAceptacionService: ActaAceptacionService,
    private route: ActivatedRoute
  ){}

  acta_aceptacion!:any;

  ngOnInit(): void {
    this.obtenerActaAceptacion()
  }

  obtenerActaAceptacion(): void {

    const id_acta: number = Number(this.route.snapshot.paramMap.get('id_acta'));

    this.actaAceptacionService.obtenerActaPorId(id_acta).subscribe({
      next: res => {
        this.acta_aceptacion = res
        console.log(this.acta_aceptacion)
      },
      error: e => {
        console.error(e)
      }
    })

  }

}
