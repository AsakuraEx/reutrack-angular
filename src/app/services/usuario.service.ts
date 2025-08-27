import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  readonly BaseUrl = 'http://10.168.241.44:3100/api';

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
