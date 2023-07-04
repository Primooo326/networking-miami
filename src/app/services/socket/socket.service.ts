// socket.service.ts

import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { ENotifyTypes } from 'src/app/tools/models';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  constructor() {}

  openSocket() {
    // Establecer la conexión con el servidor de sockets
    this.socket = io(environment.backend); // Ajusta la URL y el puerto según tu configuración del servidor de sockets

    // Escuchar el evento "notificaciones"
    this.socket.on('notify', (data: any) => {
      // Realizar acciones con los datos recibidos de las notificaciones
      console.log('Notificación recibida:', data);
    });

    // Realizar acciones adicionales después de abrir el socket
    this.socket.on('connect', () => {
      console.log('Socket conectado');
      this.socket.emit("userConnect", JSON.parse(localStorage.getItem("user")!))
    });
  }
  notifyEmitter(data: any, type:ENotifyTypes) {
    // Emitir el evento "new-notify" al servidor de sockets
    this.socket.emit('new-notify', {data,type});
  }

  closeSocket() {
    // Cerrar la conexión del socket si está abierta
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
