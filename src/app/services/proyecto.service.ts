import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  constructor(private http: HttpClient) { }

  readonly BaseURL = environment.apiURL;

  obtenerProyecto(id_proyecto: number): Observable<any> {
    const url = this.BaseURL + '/proyectos/' + id_proyecto;
    return this.http.get(url)
  }

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

  crearProyectos(data: any): Observable<any> {
    let url = this.BaseURL + '/proyectos/create';
    return this.http.post(url, data)
  }

  actualizarProyecto(data: any): Observable<any> {
    let url = this.BaseURL + '/proyectos/update/' + data.id;
    return this.http.patch(url, data)
  }



  // -----------------------------------------------------------------------------------------------------------
  // VERSIONES -------------------------------------------------------------------------------------------------

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

  crearVersion(data:any): Observable<any>{
    return this.http.post(this.BaseURL + '/versiones/create', data)
  }

  actualizarVersion(data:any){
    const url = this.BaseURL + '/versiones/update/' + data.id;
    return this.http.patch(url, data);
  }

  cancelarVersion(id_version: number) {
    return this.http.patch(`${this.BaseURL}/versiones/cancelar/${id_version}`, { estado: 'Cancelado' });
  }

}
