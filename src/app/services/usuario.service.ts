import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  readonly BaseUrl = environment.apiURL;

  obtenerUsuarios(estado: any, limit: any, page: number): Observable<any> {

    let url = this.BaseUrl + '/usuarios?';
    const params: string[] = [];

    if (estado) params.push(`estado=${encodeURIComponent(estado)}`);
    if (limit) params.push(`limit=${encodeURIComponent(limit)}`);
    if (page) params.push(`page=${encodeURIComponent(page)}`);

    // Solo agregar '?' si hay parámetros
    if (params.length > 0) {
      url += params.join('&');
    } else {
      url = this.BaseUrl + '/usuarios'; // Quitar el '?' si no hay parámetros
    }

    return this.http.get(url);

  }
}
