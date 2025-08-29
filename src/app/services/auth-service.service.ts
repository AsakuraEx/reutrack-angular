import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.apiURL + '/auth';

  constructor(private http: HttpClient) { }

  iniciarSesion(email:string, password:string): Observable<any> {
    return this.http.post(this.url+'/login', {email:email, password:password});
  }

  verificarDFA(email: string ,codigo: string): Observable<any>{
    return this.http.post(this.url+'/verify-2fa', {email: email, code: codigo})
  }

  cerrarSesion(id: number): Observable<any> {
    return this.http.post(this.url+'/logout', {id})
  }
}
