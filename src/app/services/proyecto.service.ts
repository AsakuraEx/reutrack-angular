import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  constructor(private http: HttpClient) { }

  readonly BaseURL = 'http://10.168.241.44:3100/api';

  obtenerProyectos(estado: any, limit: any, page: number): Observable<any> {
    
    let url = this.BaseURL + '/proyectos?';
    const params: string[] = [];

    if(estado) params.push(`id_estado=${encodeURIComponent(estado)}`);
    if(limit) params.push(`limit=${encodeURIComponent(limit)}`);
    if(page) params.push(`page=${encodeURIComponent(page)}`);

    if(params.length > 0){
      url += params.join('&');
    }

    return this.http.get(url)
  }

  obtenerVersiones(id_proyecto: number, estado: any, limit: any, page: number): Observable<any>  {

    let url = `${this.BaseURL}/versiones?`;
    const params: string[] = [];

    if(id_proyecto) params.push(`id_proyecto=${encodeURIComponent(id_proyecto)}`);
    if(estado) params.push(`id_estado=${encodeURIComponent(estado)}`);
    if(limit) params.push(`limit=${encodeURIComponent(limit)}`);
    if(page) params.push(`page=${encodeURIComponent(page)}`);

    if(params.length > 0) {
      url += params.join('&');
    }

    return this.http.get(url);

  }

  obtenerVersion(id_version: number): Observable<any> {
    return this.http.get(`${this.BaseURL}/versiones/version/${id_version}`);
  }


}
