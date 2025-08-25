import { Component, inject, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FrasesMotivadoras } from '../../assets/frases';
import { jwtDecode } from 'jwt-decode'
import { ReunionesProgresoComponent } from "./components/reuniones-progreso/reuniones-progreso.component";
import { ReunionesFinalizadaComponent } from "./components/reuniones-finalizada/reuniones-finalizada.component";
import { MatDialog } from '@angular/material/dialog';
import { NuevaReunionComponent } from '../reuniones-view/components/nueva-reunion/nueva-reunion.component';


@Component({
  selector: 'app-inicio-view',
  imports: [
    MatButtonModule, MatIconModule,
    ReunionesProgresoComponent, ReunionesFinalizadaComponent
],
  templateUrl: './inicio-view.component.html',
  styleUrl: './inicio-view.component.css'
})
export class InicioViewComponent implements OnInit {

    constructor() {}

    frases: any = [];
    frase!: string;
    dia!:number;

    usuario!: any;

    reunionesIniciadas!:any;
    reunionesFinalizadas!:any;

    readonly dialog = inject(MatDialog);

    openDialog(): void {
      const dialogRef = this.dialog.open(NuevaReunionComponent, {
        data: {usuario: this.usuario},
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('Se ha cerrado el dialog');
        if(result === true) {
          console.log(result);
          console.log("Se envio un true")
        }
      })
    }
    
    MostrarFrase(): void {
        const fechaActual = new Date()
        for(let item of FrasesMotivadoras){
          this.frases.push(item);
        }
        this.frase = this.frases.find( (f:any) => f.dia === fechaActual.getDate()).frase
        this.dia = fechaActual.getDate()
    }

    ngOnInit(): void {
        this.MostrarFrase();

        const token = localStorage.getItem('token');
        if(token){
          const decoded = jwtDecode(token);
          this.usuario = decoded;
        }

    }

}
