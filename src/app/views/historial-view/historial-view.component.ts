import { Component, OnInit } from '@angular/core';
import { ReunionService } from '../../services/reunion.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-historial-view',
  imports: [],
  templateUrl: './historial-view.component.html',
  styleUrl: './historial-view.component.css'
})
export class HistorialViewComponent implements OnInit {

  constructor(
    private reunionService: ReunionService
  ){}

  reuniones: any = [];

  ngOnInit(): void {
      const token = localStorage.getItem('token');
      if(token){
        const decoded:any = jwtDecode(token);

        if(decoded.id_rol && decoded.id){
          this.obtenerReuniones(decoded.id_rol, decoded.id)
        }

      }
  }

  obtenerReuniones(id_rol: number, id_usuario: number): void {

    if(id_rol != 1){

      this.reunionService.obtenerReuniones(null,10, null, null, id_usuario, 1, null, null).subscribe({
        next: response => {
          this.reuniones = response.data
          console.log(response.data)
        },
        error: err => console.log(err)
      })

    }else{

      this.reunionService.obtenerReuniones(null,10, null, null, null, 1, null, null).subscribe({
        next: response => {
          this.reuniones = response.data
          console.log(response.data)
        },
        error: err => console.log(err)
      })

    }

  }

}
