import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TablaUsuariosComponent } from './components/tabla-usuarios/tabla-usuarios.component';
import { MatDialog } from '@angular/material/dialog';
import { AgregarUsuariosFormComponent } from './components/agregar-usuarios-form/agregar-usuarios-form.component';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-view',
  imports: [
    MatButtonModule, MatIconModule, TablaUsuariosComponent
  ],
  templateUrl: './usuario-view.component.html',
  styleUrl: './usuario-view.component.css'
})
export class UsuarioViewComponent implements OnInit{

  constructor(
    private usuarioService: UsuarioService
  ){}

  usuarios: any[] = [];
  totalRegistros: number = 0;
  readonly dialog = inject(MatDialog)

  ngOnInit(): void {
      this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {

    this.usuarioService.obtenerUsuarios(null, null, 1).subscribe(res => {
      this.usuarios = res.data;
      this.totalRegistros = res.totalRecords;
    })

  }

  mostrarAgregarForm(): void {
    const dialogRef = this.dialog.open(AgregarUsuariosFormComponent, {
      minWidth: '520px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.obtenerUsuarios();
      }
    })
  }

  actualizarUsuarios(): void {
    this.obtenerUsuarios();
  }
  
}
