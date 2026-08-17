import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InstanciasService } from '../../../../services/instancias.service';
import { MatButtonModule } from '@angular/material/button';
import { HotToastService } from '@ngxpert/hot-toast';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-compartir-modal',
  imports: [MatDialogContent, MatIconModule, MatButtonModule],
  templateUrl: './compartir-modal.component.html',
  styleUrl: './compartir-modal.component.css'
})
export class CompartirModalComponent implements OnInit{
  constructor(
    private instanciaService: InstanciasService,
    private toastService: HotToastService
  ){}

  id_instancia: string = '';
  instanciaSeleccionada: string = '';
  instanciaActual: string = environment.backendURL;
  
  instancias: any[] = [];

  readonly dialogRef = inject(MatDialogRef<CompartirModalComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
      this.obtenerInstancias();
  }

  obtenerInstancias(): void {
    this.instanciaService.obtenerInstancias().subscribe({
      next: response => {
        this.instancias = response;
        console.log(this.instancias)
      },
      error: err => {
        console.error(err)
      }
    })
  }

  seleccionarInstancia(id: string, host: string): void{
    this.id_instancia = id;
    this.instanciaSeleccionada = host;
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  enviarReunion(): void {

    if(!this.instanciaSeleccionada) {
      this.toastService.error('No ha seleccionado una instancia de reutrack', {
        position: 'top-right',
        duration: 3000
      })
      return;
    }

    const data = {
      id_reunion: this.data.reunion.id,
      host: this.instanciaSeleccionada,
      usuario: this.data.usuario,
    }

    this.instanciaService.enviarReunion(data).subscribe({
      next: response => {
        this.toastService.success(response.msj, {
          position: 'top-right',
          duration: 3000
        })
      },
      error: err => {
        this.toastService.error(err.error.error, {
          position: 'top-right',
          duration: 3000
        })
      }
    })

    this.onCancelar();

  }

}
