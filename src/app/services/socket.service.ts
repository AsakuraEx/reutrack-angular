import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;
  private readonly server_url: string = 'http://10.168.241.44:3100';

  constructor() { 
    this.socket = io(this.server_url, {
      withCredentials: true,
    })
  }

  emitirEvento(nombreEvento: string, payload: any): void {
    this.socket.emit(nombreEvento, payload);
  }

  escucharEvento(nombreEvento: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(nombreEvento, (data) => {
        subscriber.next(data);
      })
      
      return () => {
        this.socket.off(nombreEvento);
      }
    })
  }

  desconectar(): void {
    if(this.socket) {
      this.socket.disconnect();
    }
  }
}
