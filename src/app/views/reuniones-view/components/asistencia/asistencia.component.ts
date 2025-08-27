import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AsistenciaFormComponent } from '../asistencia-form/asistencia-form.component';
import { ReunionService } from '../../../../services/reunion.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-asistencia',
  imports: [
    MatIconModule, MatButtonModule, MatTableModule
  ],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.css'
})
export class AsistenciaComponent implements OnInit{

  constructor(
    private reunionService: ReunionService,
    private toastService: HotToastService
  ) {}

  @Input() id_reunion!: number;

  columnasMostradas: string[] = ['nombre', 'dui', 'cargo', 'institucion', 'telefono', 'correo', 'acciones'];
  participantes: any = [ 'algo' ];

  readonly dialog = inject(MatDialog)

  ngOnInit(): void {
      this.consultarParticipantes(this.id_reunion)
  }

  abrirAsistenciaModal(): void {
    const dialogRef = this.dialog.open(AsistenciaFormComponent, {
      data: { id_reunion: this.id_reunion },
      minWidth: '560px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true) {
        this.consultarParticipantes(this.id_reunion)
      }
    })
  }

  consultarParticipantes(id_reunion:number): void {

    this.reunionService.consultarParticipantes(id_reunion).subscribe({
      next: response => {
        this.participantes = response
      },
      error: err => {
        console.error("Error: ", err)
      }
    })
    
  }

  eliminarParticipante(id_participante: number): void {

    this.reunionService.eliminarParticipantes(id_participante).subscribe({
      next: response => {
        this.toastService.success('Se ha eliminado la asistencia correctamente', {
          duration: 3000,
          position: 'top-right'
        });
        this.consultarParticipantes(this.id_reunion)
      },
      error: err => {
        console.error("Error: ", err)
      }
    })

  }

}
