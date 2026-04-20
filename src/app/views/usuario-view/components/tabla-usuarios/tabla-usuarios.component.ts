import { Component, EventEmitter, inject, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UsuarioService } from '../../../../services/usuario.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AgregarUsuariosFormComponent } from '../agregar-usuarios-form/agregar-usuarios-form.component';

@Component({
  selector: 'app-tabla-usuarios',
  imports: [
    MatTableModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatPaginatorModule
  ],
  templateUrl: './tabla-usuarios.component.html',
  styleUrl: './tabla-usuarios.component.css'
})
export class TablaUsuariosComponent implements OnChanges{

  constructor(
    private usuarioService: UsuarioService
  ){}

  @Input() usuarios!: any[];
  @Input() totalRegistros:number = 0;
  @Output() actualizarUsuarios = new EventEmitter<void>();

  displayedColumns: string[] = ['nombre', 'email', 'cargo','documento', 'telefono', 'rol', 'estado', 'acciones']
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator

  readonly dialog = inject(MatDialog)

  ngOnChanges(): void {
      this.obtenerUsuarios()
  }

  obtenerUsuarios(): void {
    this.dataSource.data = this.usuarios;
    this.totalRegistros = this.totalRegistros;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  cambiarEstado(usuario: any): void {
    this.usuarioService.cambiarEstado(usuario.id, usuario.id_estado).subscribe(()=>{
      this.actualizarUsuarios.emit()
    })
  }

  mostrarEditarUsuario(usuario: any): void {
    const dialogRef = this.dialog.open(AgregarUsuariosFormComponent, {
      data: usuario,
      minWidth: '520px'
    });

    dialogRef.afterClosed().subscribe(result=>{
      if(result === true) {
        this.actualizarUsuarios.emit();
      }
    })
  }

  formatearTelefono (telefono?: string | undefined): string {
    if(telefono) {
      if (telefono.length > 0 && telefono.length < 9) {
        const cadena = telefono.substring(0, 4) + '-' + telefono.substring(4, 8);
        return cadena;
      } 
      
      else if(telefono.length === 9){
        return telefono;
      } else{
        return telefono;
      }
    } else {
      return '-'
    }
  }

  formatearDUI (dui?: string | undefined): string {
    if(dui){
      if (dui.length > 0 && dui.length < 10) {
        const cadena = dui.substring(0, 8) + '-' + dui.substring(8,9);
        return cadena;
      } 
      else if(dui.length === 10){
        return dui;
      } else {
        return dui;
      }
    } else {
      return '-'
    }
  }

}
