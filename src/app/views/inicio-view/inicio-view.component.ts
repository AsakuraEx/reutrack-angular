import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { FrasesMotivadoras } from '../../assets/frases';
import { jwtDecode } from 'jwt-decode'
import { ReunionService } from '../../services/reunion.service';
import { ReunionesProgresoComponent } from "./components/reuniones-progreso/reuniones-progreso.component";
import { ReunionesFinalizadaComponent } from "./components/reuniones-finalizada/reuniones-finalizada.component";
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-inicio-view',
  imports: [
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatTableModule, MatPaginatorModule,
    ReunionesProgresoComponent,
    ReunionesFinalizadaComponent
],
  templateUrl: './inicio-view.component.html',
  styleUrl: './inicio-view.component.css'
})
export class InicioViewComponent implements OnInit {

    constructor(private reunionService: ReunionService) {}

    frases: any = [];
    frase!: string;
    dia!:number;

    usuario!: any;

    reunionesIniciadas!:any;
    reunionesFinalizadas!:any;


    dataSource2 = new MatTableDataSource<any>();
    
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

        this.ObtenerReuniones();

    }

    ObtenerReuniones(): void {
      if(this.usuario.id_rol !== 1){
        
        forkJoin({
          iniciadas: this.reunionService.obtenerReunionesIniciadas(10, this.usuario.id, 1),
          finalizadas: this.reunionService.obtenerReunionesFinalizadas(10, this.usuario.id, 1)
        }).subscribe({
          next: (responses) => {
            this.reunionesIniciadas = responses.iniciadas;
            this.reunionesFinalizadas = responses.finalizadas;
          },
          error: (err) => {
            console.log(err);
          }
        });
      
      }else {

        forkJoin({
          iniciadas: this.reunionService.obtenerReunionesIniciadas(5, null, 1),
          finalizadas: this.reunionService.obtenerReunionesFinalizadas(5, null, 1)
        }).subscribe({
          next: (responses) => {
            this.reunionesIniciadas = responses.iniciadas;
            this.reunionesFinalizadas = responses.finalizadas;
          },
          error: (err) => {
            console.log(err);
          }
        });

      }
    }

}
