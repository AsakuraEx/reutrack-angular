import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReunionService {

  private readonly BaseUrl = 'http://10.168.241.44:3100/api';

  constructor(private http: HttpClient) { }

  obtenerReuniones(estado:any, limite:any, codigo:any, proyecto:any, usuario:any, page:any, desde:any, hasta:any): Observable<any> {
    
    let url = this.BaseUrl + '/reuniones?';
    const params: string[] = [];

    if (estado) params.push(`id_estado=${encodeURIComponent(estado)}`);
    if (limite) params.push(`limit=${encodeURIComponent(limite)}`);
    if (codigo) params.push(`codigo=${encodeURIComponent(codigo)}`);
    if (proyecto) params.push(`id_proyecto=${encodeURIComponent(proyecto)}`);
    if (usuario) params.push(`id_usuario=${encodeURIComponent(usuario)}`);
    if (page) params.push(`page=${encodeURIComponent(page)}`);
    if (desde) params.push(`desde=${encodeURIComponent(desde)}`);
    if (hasta) params.push(`hasta=${encodeURIComponent(hasta)}`);

    // Solo agregar '?' si hay parámetros
    if (params.length > 0) {
      url += params.join('&');
    } else {
      url = this.BaseUrl; // Quitar el '?' si no hay parámetros
    }

    return this.http.get(url)
  }

  obtenerReunionesIniciadas(limite:number, usuario:any, page:number): Observable<any> {

    let url = this.BaseUrl + `/reuniones?id_estado=1&`
    const params: string[] = [];

    if(limite) params.push(`limit=${encodeURIComponent(limite)}`)
    if(usuario) params.push(`id_usuario=${encodeURIComponent(usuario)}`)
    if(page) params.push(`page=${encodeURIComponent(page)}`)

    if(params.length > 0){
      url += params.join('&');
    } else {
      url = this.BaseUrl
    }

    return this.http.get(url)

  }

  obtenerReunionesFinalizadas(limite:number, usuario:any, page:number): Observable<any> {

    let url = this.BaseUrl + `/reuniones?id_estado=3&`
    const params: string[] = [];

    if(limite) params.push(`limit=${encodeURIComponent(limite)}`)
    if(usuario) params.push(`id_usuario=${encodeURIComponent(usuario)}`)
    if(page) params.push(`page=${encodeURIComponent(page)}`)

    if(params.length > 0){
      url += params.join('&');
    } else {
      url = this.BaseUrl
    }

    return this.http.get(url)

  }

  crearNuevaReunion(data: any): Observable<any> {
    const url = `${this.BaseUrl}/reuniones/create`
    return this.http.post(url, data)
  }

  obtenerReunionPorCodigo(codigo:string): Observable<any> {
    const url = `${this.BaseUrl}/reuniones/reunion-actual/${codigo}`;
    return this.http.get(url)
  }

  obtenerResponsablesPorReunion(id_reunion: number): Observable<any> {
    const url = `${this.BaseUrl}/encargados/${id_reunion}`;
    return this.http.get(url)
  }

  agregarResponsables(data: any): Observable<any> {
    const url = `${this.BaseUrl}/encargados/create`;
    return this.http.post(url, data);
  }

  eliminarResponsable(id_encargado: number): Observable<any> {
    const url = `${this.BaseUrl}/encargados/delete/${id_encargado}`
    return this.http.delete(url)
  }

  agregarParticipante(data: any): Observable<any> {
    const url = `${this.BaseUrl}/asistencia/create`;
    return this.http.post(url, data)
  }

  consultarParticipantes(id_reunion: number): Observable<any> {
    const url = `${this.BaseUrl}/asistencia/${id_reunion}`;
    return this.http.get(url)
  }

  eliminarParticipantes(id_participante: number): Observable<any> {
    const url = `${this.BaseUrl}/asistencia/delete/${id_participante}`;
    return this.http.delete(url)
  }

}
