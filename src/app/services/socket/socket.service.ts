// socket.service.ts

import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { ENotifyTypes } from 'src/app/tools/models';
import { Store } from '@ngrx/store';
import { newNotification, newPendingMatch } from 'src/redux/actions';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  constructor(private store: Store<any>) {}

  openSocket() {
    // Establecer la conexión con el servidor de sockets
    this.socket = io(environment.backend); // Ajusta la URL y el puerto según tu configuración del servidor de sockets

    // Escuchar el evento "notificaciones"
    this.socket.on('notify', (data: any) => {
      // Realizar acciones con los datos recibidos de las notificaciones
      console.log('Notificación recibida:', data);
      this.store.dispatch(
        newNotification.set({
          data: data.data,
          title: data.title,
          message: data.message,
          time: data.time,
        })
      );
      if ((data.type = 'match')) {
        this.store.dispatch(newPendingMatch.set(data.data));
      }
    });

    this.socket.on('newMatch', (data: any) => {
      console.log('Nuevo match:', data);
    });

    // Realizar acciones adicionales después de abrir el socket
    this.socket.on('connect', () => {
      console.log('Socket conectado');
      const engine = this.socket.io.engine;
      console.log(engine.transport.name); // in most cases, prints "polling"

      engine.once('upgrade', () => {
        // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
        console.log(engine.transport.name); // in most cases, prints "websocket"
      });
      this.socket.emit(
        'userConnect',
        JSON.parse(localStorage.getItem('user')!)
      );
    });

    this.socket.on('disconnect', (d) => {
      console.log('Socket desconectado ', d);
    });
  }
  notifyEmitter(data: any, type: ENotifyTypes) {
    // Emitir el evento "new-notify" al servidor de sockets
    this.socket.emit('new-notify', { data, type });
  }

  closeSocket() {
    // Cerrar la conexión del socket si está abierta
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
