import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { ProyectoService } from '../../../services/proyecto.service';
import { MatDialog } from '@angular/material/dialog';
import { FormProyectosComponent } from './components/form-proyectos/form-proyectos.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-proyectos-view',
  imports: [
    MatButtonModule, MatIconModule, MatTableModule, MatTooltipModule,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    RouterLink
],
  templateUrl: './proyectos-view.component.html',
  styleUrl: './proyectos-view.component.css'
})
export class ProyectosViewComponent implements OnInit{

  constructor(
    private proyectoService: ProyectoService,
    private router: Router
  ){}

  proyectos: any = [];
  displayedColumns = ['proyecto', 'usuario', 'fecha', 'accion'];
  readonly dialog = inject(MatDialog)

  proyectoBuscado = new FormControl('');

  ngOnInit(): void {
      this.obtenerProyectos();
  }

  obtenerProyectos():void {

    this.proyectoService.obtenerProyectos(null, 10, 1).subscribe({
      next: response => {
        console.log(response)
        this.proyectos = response.data
      },
      error: err => {
        console.log(err)
      } 
    })

  }

  mostrarModal(): void {

    const dialogRef = this.dialog.open(FormProyectosComponent, {
      minWidth: '340px'
    });

    dialogRef.afterClosed().subscribe(result => {
        if(result === true) {
          this.obtenerProyectos();
        }
      })

  }

  transformarFecha(fecha: string): string  {
      
      const nuevaFecha = new Date(fecha)

      const fechaFormateada = nuevaFecha.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',   // Hora en formato de dos dígitos
          minute: '2-digit', // Minutos en formato de dos dígitos
          second: '2-digit', // Segundos en formato de dos dígitos
          hour12: true
      });

      return fechaFormateada
  }

}
