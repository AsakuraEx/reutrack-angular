import { Component, inject, OnInit } from '@angular/core';
import { ActaAceptacionService } from '../../services/acta-aceptacion.service';
import { ActivatedRoute } from '@angular/router';
import { FuncionalidadesComponent } from './components/funcionalidades/funcionalidades.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from '@angular/material/dialog';
import { FinalizarActaComponent } from './components/finalizar-acta/finalizar-acta.component';
import { MatIconModule } from '@angular/material/icon';
import { ProyectoService } from '../../services/proyecto.service';

@Component({
  selector: 'app-acta-aceptacion-view',
  imports: [
    FuncionalidadesComponent, UsuariosComponent,
    MatButtonModule, MatIconModule
],
  templateUrl: './acta-aceptacion-view.component.html',
  styleUrl: './acta-aceptacion-view.component.css'
})
export class ActaAceptacionViewComponent  implements OnInit{

  constructor(
    private actaAceptacionService: ActaAceptacionService,
    private proyectoService: ProyectoService,
    private route: ActivatedRoute,
  ){}

  acta_aceptacion!:any;
  readonly dialog = inject(MatDialog)

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

  finalizarActaAceptacion(): void {
   
    const id_acta: number = Number(this.route.snapshot.paramMap.get('id_acta'));

    const dialogRef = this.dialog.open(FinalizarActaComponent, {
      data: { id_acta }
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.obtenerActaAceptacion()
        this.finalizarVersion()
      }
    })

  }

  finalizarVersion(): void {

    if(this.acta_aceptacion.version.id) {
      const id_version = this.acta_aceptacion.version.id
      this.proyectoService.finalizarVersion(id_version).subscribe(()=>{
        console.log("Versión finalizada")
      });
      return
    }

    console.error("No hay un id de versión especificado...")

  }

  irAtras(): void {
    window.history.back();
  }

}
