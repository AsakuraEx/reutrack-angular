import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  constructor(private http: HttpClient) { }

  readonly BaseURL = 'http://10.168.241.44:3100/api/proyectos';

  obtenerProyectos(estado: any, limit: any, page: number): Observable<any> {
    
    let url = this.BaseURL + '?';
    const params: string[] = [];

    if(estado) params.push(`id_estado=${encodeURIComponent(estado)}`);
    if(limit) params.push(`limit=${encodeURIComponent(limit)}`);
    if(page) params.push(`page=${encodeURIComponent(page)}`);

    if(params.length > 0){
      url += params.join('&');
    } else {
      url = this.BaseURL
    }

    return this.http.get(url)
  }


}
