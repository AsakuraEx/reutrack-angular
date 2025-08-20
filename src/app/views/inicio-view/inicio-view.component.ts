import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FrasesMotivadoras } from '../../assets/frases';

@Component({
  selector: 'app-inicio-view',
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './inicio-view.component.html',
  styleUrl: './inicio-view.component.css'
})
export class InicioViewComponent implements OnInit {

    frases: any = [];
    frase!: string;
    dia!:number;

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
    }

}
