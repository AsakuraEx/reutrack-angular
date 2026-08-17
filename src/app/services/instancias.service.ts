import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstanciasService {

  private readonly BaseUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  // Instancias de reutrack
  obtenerInstancias(): Observable<any> {
    return this.http.get(this.BaseUrl + '/instancias_reutrack');
  }

  enviarReunion(data: any): Observable<any> {
    const url = this.BaseUrl + '/instancias_reutrack/enviarReunion'
    return this.http.post(url, data)
  }

}
