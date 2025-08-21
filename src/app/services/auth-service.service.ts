import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://10.168.241.44:3100/api/auth';

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
