import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReunionService {

  private readonly BaseUrl = environment.apiURL;

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

  consultarMinutaReunion(id_reunion:number): Observable<any>{
    const url = `${this.BaseUrl}/minutareunion/${id_reunion}`;
    return this.http.get(url);   
  }

  guardarMinutaReunion(data: any): Observable<any> {
    const url = `${this.BaseUrl}/minutareunion/create`;
    return this.http.post(url, data);    
  }

  actualizarMinutaReunion(id_reunion: number, data: any): Observable<any> {
    const url = `${this.BaseUrl}/minutareunion/update/${id_reunion}`;
    return this.http.patch(url, data);
  }

  finalizarReunion(id_reunion: number): Observable<any> {
    const url = `${this.BaseUrl}/reuniones/finalizar/${id_reunion}`;
    return this.http.patch(url, {})
  }

  obtenerDetalleReunion(id_reunion: number): Observable<any> {
    const url = `${this.BaseUrl}/reuniones/detalle/${id_reunion}`;
    return this.http.get(url)
  }

  cancelarReunion(id_reunion: number): Observable<any> {
    const url = `${this.BaseUrl}/reuniones/cancelar/${id_reunion}`;
    return this.http.patch(url, {})
  }

  reactivarReunion(data: any): Observable<any> {
    const url = `${this.BaseUrl}/reuniones/reactivar`;
    return this.http.patch(url, data)
  }


  // ---------------------------------------------------------------------
  // Responsables

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

  // ---------------------------------------------------------------------
  // Lista de asistencia

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

  // ---------------------------------------------------------------------
  // Puntos de reunión

  consultarPuntos(id_reunion: number): Observable<any> {
    const url = `${this.BaseUrl}/puntoreunion/${id_reunion}`
    return this.http.get(url)
  }

  agregarPuntos(data: any): Observable<any> {
    const url = `${this.BaseUrl}/puntoreunion/create`
    return this.http.post(url, data)
  }

  eliminarPunto(id_punto: number): Observable<any> {
    const url = `${this.BaseUrl}/puntoreunion/delete/${id_punto}`
    return this.http.delete(url)
  }

  // ---------------------------------------------------------------------
  // Acuerdos de reunión

  consultarAcuerdos(id_reunion: number): Observable<any> {
    const url = `${this.BaseUrl}/acuerdocompromiso/${id_reunion}`
    return this.http.get(url)
  }

  agregarAcuerdos(data: any): Observable<any> {
    const url = `${this.BaseUrl}/acuerdocompromiso/create`
    return this.http.post(url, data)
  }

  eliminarAcuerdo(id_punto: number): Observable<any> {
    const url = `${this.BaseUrl}/acuerdocompromiso/delete/${id_punto}`
    return this.http.delete(url)
  }

  //---------------------------------------------------------------------------------------
  // PDF

  generarPDF(id_reunion: number): Observable<any> {
    const url = `${this.BaseUrl}/reuniones/pdf/${id_reunion}`
    return this.http.get(url, {
      responseType: 'blob'
    })
  }

}
