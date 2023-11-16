// socket.service.ts

import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { ENotifyTypes, Usuario } from 'src/app/tools/models';
import { Store } from '@ngrx/store';
import {
  newNotification,
  newPendingMatch,
  myMatches,
  myRequestMatches,
  myMessages,
  setUser,
} from 'src/redux/actions';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket!: Socket;

  constructor(private store: Store<any>) {}

  openSocket() {
    // Establecer la conexión con el servidor de sockets
    this.socket = io(environment.backend); // Ajusta la URL y el puerto según tu configuración del servidor de sockets

    // Escuchar el evento "notificaciones"
    this.socket.on('notify', (data: any) => {
      // Realizar acciones con los datos recibidos de las notificaciones
      this.store.dispatch(
        newNotification.set({
          data: data.data,
          title: data.title,
          message: data.message,
          time: data.time,
          id: data.id,
        })
      );
      if ((data.type = 'match')) {
        this.store.dispatch(newPendingMatch.set(data.data));
      }
    });

    this.socket.on('newMatch', (data: any) => {
      this.store.dispatch(myMatches.set(data));
      this.store.dispatch(newPendingMatch.delete(data));
      this.store.dispatch(myRequestMatches.delete(data));
    });

    this.socket.on('deleteRequestMatch', (data: any) => {
      this.store.dispatch(newPendingMatch.delete(data));
    });
    this.socket.on('rejectPendingMatch', (data: any) => {
      this.store.dispatch(myRequestMatches.delete(data));
    });
    this.socket.on('deleteMatch', (data: any) => {
      this.store.dispatch(newPendingMatch.delete(data));
      this.store.dispatch(myMatches.delete(data));
    });
    this.socket.on('newMessage', (data: any) => {
      this.store.dispatch(myMessages.set(data));
    });
    // Realizar acciones adicionales después de abrir el socket
    this.socket.on('connect', () => {
      const engine = this.socket.io.engine;

      engine.once('upgrade', () => {
        // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
      });
      this.socket.emit(
        'userConnect',
        JSON.parse(localStorage.getItem('user')!)
      );
    });
    if (this.user.verificado == 0) {
      this.socket.on('emailverification', (data: any) => {
        this.store.dispatch(setUser.verifyEmail(data));
        this.socket.off('emailverification');
      });
    }

    this.socket.on('disconnect', (d) => {});
  }
  notifyEmitter(data: any, type: ENotifyTypes) {
    // Emitir el evento "new-notify" al servidor de sockets
    this.socket.emit('new-notify', { data, type });
  }

  get user(): Usuario {
    return JSON.parse(localStorage.getItem('user')!);
  }
  closeSocket() {
    // Cerrar la conexión del socket si está abierta
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
