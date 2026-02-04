import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-motivo-cancelacion-modal',
  imports: [],
  templateUrl: './motivo-cancelacion-modal.component.html',
  styleUrl: './motivo-cancelacion-modal.component.css'
})
export class MotivoCancelacionModalComponent implements OnInit {

  constructor(
    private usuarioService: UsuarioService
  ) {}

  usuario!:any;

  ngOnInit(): void {

    if(this.data.usuario_cancela){
      this.usuarioService.obtenerUsuario(this.data.usuario_cancela).subscribe({
        next: response => {
          this.usuario = response;
        },
        error: err => {
          console.log(err)
        }
      })
    }

  }

  readonly data = inject(MAT_DIALOG_DATA)


}
