import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ReunionService } from '../../../../services/reunion.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { EncargadosProgramadosComponent } from '../../../reuniones-view/components/encargados-programados/encargados-programados.component';
import { ReprogramacionComponent } from '../reprogramacion/reprogramacion.component';

@Component({
  selector: 'app-lista-eventos-modal',
  imports: [
    MatButtonModule, MatIconModule, MatTooltipModule, EncargadosProgramadosComponent, ReprogramacionComponent
  ],
  templateUrl: './lista-eventos-modal.component.html',
  styleUrl: './lista-eventos-modal.component.css'
})
export class ListaEventosModalComponent{

  constructor(
    private router: Router, 
    private reunionService: ReunionService,
    private toastService: HotToastService
  ) {}

  readonly dialogRef = inject(MatDialogRef<ListaEventosModalComponent>);

  readonly data = inject(MAT_DIALOG_DATA);

  estados:any = {
    Iniciado: 'bg-yellow-500',
    Finalizado: 'bg-blue-500',
    Cancelado: 'bg-red-500',
    Programado: 'bg-purple-500'
  }

  reunionProgramada: any = {}
  verEncargados: boolean = false;
  verReprogramacion: boolean = false;

  async iniciarReunion(id: number): Promise<any> {

    try {
      await this.reunionService.iniciarReunion(id).subscribe({
        next: response => {
          this.continuarReunion(response.codigo)
        },
        error: err => {
          this.toastService.error('Ocurrio un error al iniciar la reunión: ' + err.error.error, {
            position: 'bottom-right',
            duration: 3000
          });
        }
      })
    } catch (e) {
      console.error(e)
    }


  }

  continuarReunion(codigo: string) {
    this.router.navigate(['/reunion', codigo]);
    this.dialogRef.close();
  }

  verReunion(id: string) {
    this.router.navigate(['/reunion/detalle', id]);
    this.dialogRef.close();
  }


  claseEstado (estado: string): string {
    return `${ this.estados[estado] }`
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

  transformarFechaSinHora(fecha: string): string  {
      
      const nuevaFecha = new Date(fecha)

      const nuevaFechaSinHora = new Date(nuevaFecha.getFullYear(), nuevaFecha.getMonth(), nuevaFecha.getDate()+1);

      const fechaFormateada = nuevaFechaSinHora.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour12: true
      });

      return fechaFormateada

  }

  programadaParaHoy(fechaReunion: Date): boolean {

    const nuevaFechaReunion = fechaReunion.toString().substring(0,10)
    const fechaActual = new Date().toISOString().substring(0,10)

    if(fechaActual === nuevaFechaReunion){
      return true;
    }
    return false;
  }

  modificarEncargados(reunion: any): void {

    this.reunionProgramada = reunion;
    this.verEncargados = true;

  }

  ocultarEncargados(event: any): void {
    this.verEncargados = event;
    this.verReprogramacion = event;
  }

  mostrarReprogramacion(reunion:any): void {
    this.verReprogramacion = true
    this.reunionProgramada = reunion
  }


}
