import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../../environments/environment';
import { QRCodeComponent } from 'angularx-qrcode';
import { ActivatedRoute } from '@angular/router';
import { ActaAceptacionService } from '../../../../services/acta-aceptacion.service';

@Component({
  selector: 'app-usuarios',
  imports: [
    MatButtonModule, MatIconModule, QRCodeComponent
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit{


  constructor(
    private route: ActivatedRoute,
    private actaAceptacionService: ActaAceptacionService
  ){}

  baseURL = environment.appURL;
  backURL = environment.backendURL
  pathQR!: string

  usuarios: any[] = []

  expandirPanel:boolean = false

  ngOnInit(): void {
    const id_acta: number = Number(this.route.snapshot.paramMap.get('id_acta'));
    this.pathQR = this.baseURL + '/acta_aceptacion/aprobacion/'+ id_acta
    this.obtenerUsuarios()
  }

  mostrarUsuarios(): void {
    this.expandirPanel = !this.expandirPanel
  }

  obtenerUsuarios(): void {
    const id_acta: number = Number(this.route.snapshot.paramMap.get('id_acta'));
    this.actaAceptacionService.obtenerUsuarioActa(id_acta).subscribe(res=>{
      console.log(res)
      this.usuarios = res;
    })
  }

}
