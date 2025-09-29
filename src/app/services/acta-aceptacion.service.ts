import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActaAceptacionService {

  constructor(
    private http: HttpClient
  ) { }

  baseUrl = environment.apiURL

  obtenerActaPorVersion(id_version: number): Observable<any> {
    const url = this.baseUrl + '/acta_aceptacion/' + id_version;
    return this.http.get(url)
  }

  obtenerActaPorId(id_acta: number): Observable<any> {
    const url = this.baseUrl + '/acta_aceptacion/actual/' + id_acta;
    return this.http.get(url)
  }

  crearActaAceptacion(data: any): Observable<any> {
    const url = this.baseUrl + '/acta_aceptacion';
    return this.http.post(url, data)

  }

  finalizarActaAceptacion(id_acta: number): Observable<any> {
    const url = this.baseUrl + '/acta_aceptacion/' + id_acta;
    return this.http.put(url, {})  
  }

  obtenerPdf(id_acta: number): Observable<any> {
    const url = this.baseUrl + '/acta_aceptacion/pdf/' + id_acta;
    return this.http.get(url, { responseType: 'blob' })
  }

  /* -------------------------------------------------------------------*/

  obtenerFuncionesPorActa(id_acta: number): Observable<any> {
    const url = this.baseUrl + '/acta_funcionalidades';
    return this.http.get(url, { params: { id_acta }})
  }

  agregarFunciones(data: any): Observable<any> {
    const url = this.baseUrl + '/acta_funcionalidades';
    return this.http.post(url, data)  
  }

  aprobarFunciones(id_funcionalidad: number): Observable<any> {
    const url = this.baseUrl + '/acta_funcionalidades/' + id_funcionalidad;
    return this.http.put(url, { aprobado: true })  
  }

  eliminarFunciones(id_funcionalidad: number): Observable<any> {
    const url = this.baseUrl + '/acta_funcionalidades/' + id_funcionalidad;
    return this.http.delete(url)  
  }

  /* -------------------------------------------------------------------------- */

  agregarUsuarioActa(data: FormData): Observable<any> {
    const url = this.baseUrl + '/acta_usuarios';
    return this.http.post(url, data)  
  }

  obtenerUsuarioActa(id_acta: number): Observable<any> {
    const url = this.baseUrl + '/acta_usuarios/all/' + id_acta;
    return this.http.get(url)  
  }

}
