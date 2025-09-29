import { Component, OnInit } from '@angular/core';
import { ProyectoService } from '../../../services/proyecto.service';
import { ReunionService } from '../../../services/reunion.service';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-seguimiento-view',
  imports: [],
  templateUrl: './seguimiento-view.component.html',
  styleUrl: './seguimiento-view.component.css'
})
export class SeguimientoViewComponent implements OnInit {

  reuniones:any[] = [];
  proyecto!:any;

  constructor(
    private proyectoService: ProyectoService,
    private reunionService: ReunionService,
    private toastService: HotToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
      this.obtenerReuniones();
  }

  obtenerReuniones() {

    const id_proyecto = Number(this.route.snapshot.paramMap.get('id_proyecto'));
    if(!id_proyecto) return;
    this.proyectoService.obtenerProyecto(id_proyecto).subscribe({
      next: (response) => {
        this.proyecto = response;
        this.reunionService.obtenerReuniones(null,null,null, id_proyecto, null, null, null, null).subscribe({
          next: response => {
            this.reuniones = response.data;
          },
          error: e => {
            this.toastService.error('Error al obtener las reuniones: ' + e , {
              duration: 3000,
              position: 'top-right'
            });
          }
        });
      },
      error: (error) => {
        this.toastService.error('Error al obtener el proyecto: ' + error , {
          duration: 3000,
          position: 'top-right'
        });
      }
    })

  }

  estados:any = {
      Iniciado: 'bg-yellow-500',
      Finalizado: 'bg-blue-500',
      Cancelado: 'bg-red-500'
  }

  claseEstado(estado: string) :string{
    return `${this.estados[estado]}`
  }

  numeroPar(numero: number): boolean {
    return numero % 2 === 0;
  }

  transformarFecha(fecha:string): string {
      
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
