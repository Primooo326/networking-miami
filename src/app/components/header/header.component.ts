import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Injectable,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { Chat, EPages, Usuario, UsuarioMatch } from 'src/app/tools/models';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  userSelect,
  matchPendingSelect,
  notificationSelect,
  matchSelect,
  messagesSelect,
} from 'src/redux/selectors';
import Swal from 'sweetalert2';
import { MatchService } from 'src/app/services/match/match.service';
import {
  myMatches,
  newNotification,
  newPendingMatch,
  userChat,
} from 'src/redux/actions';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  page: EPages = EPages.landing;
  user$ = this.store.select(userSelect);
  user!: Usuario | null;
  matchsRequest$ = this.store.select(matchPendingSelect);
  misMatches$ = this.store.select(matchSelect);
  misMatchesChat: UsuarioMatch[] = [];
  misMatchesFijados: UsuarioMatch[] = [];
  notification$ = this.store.select(notificationSelect);
  messages$ = this.store.select(messagesSelect);
  userChat!: Usuario | null;
  isCloseChat = true;
  isOpenSideBarChat = false;
  notificaciones: any[] = [];
  misMensajesNoVistos: any = [];
  @Output() event = new EventEmitter();
  @ViewChild('parentElement') parentElementRef!: ElementRef;
  showChild: boolean[] = [];
  showCollapse(index: number) {
    this.showChild[index] = true;
  }
  hideCollapse(index: number) {
    this.showChild[index] = false;
  }
  constructor(
    private locate: Location,
    private route: Router,
    private matchSrvc: MatchService,
    private notifySrvc: NotifyService,
    private chatSrvc: ChatService,
    private store: Store<any>
  ) {
    this.locate.onUrlChange(() => {
      switch (this.locate.path()) {
        case '/home':
          this.page = EPages.home;
          break;
        case '/login':
          this.page = EPages.login;
          break;
        case '':
          this.page = EPages.landing;
          break;
        default:
          this.page = EPages.home;
          break;
      }
    });
  }
  async ngOnInit() {
    this.notification$.subscribe((data: any) => {
      this.notificaciones = data;
    });
    this.user$.subscribe((data) => {
      this.user = data;
    });
    this.misMatches$.subscribe((data) => {
      this.misMatchesChat = data.filter((item: any) => item.fijado === 0);
      this.misMatchesFijados = data.filter((item: any) => item.fijado === 1);
    });
    this.messages$.subscribe((data: any) => {
      this.misMensajesNoVistos = data.filter(
        (item: any) => item.estado === 'no_visto'
      );
      if (data[0].remitente_id === this.user?.id) {
        this.organizarChatsDesdeRemitente(data);
      } else {
        this.organizarChats(data);
      }
    });
  }

  calcularTiempoTranscurrido(desde: string): string {
    const fechaActual = new Date();
    const fechaPasada = new Date(desde);
    const diferenciaMilisegundos =
      fechaActual.getTime() - fechaPasada.getTime();

    // Cálculo de las diferentes unidades de tiempo
    const segundos = Math.floor(diferenciaMilisegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) {
      return `Hace ${dias} día(s)`;
    } else if (horas > 0) {
      return `Hace ${horas} hora(s)`;
    } else if (minutos > 0) {
      return `Hace ${minutos} minuto(s)`;
    } else {
      return `Hace unos segundos`;
    }
  }

  async aceptar(user: Usuario) {
    Swal.fire({
      title: '¿Seguro quieres aceptar la solicitud?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const currentUser = JSON.parse(localStorage.getItem('user')!);
        const body = {
          idToMatch: user.id,
          idUser: currentUser.id,
        };
        const res = await this.matchSrvc.createMatch(body);
        res.subscribe(
          (data) => {
            user.fijado = 0;
            this.store.dispatch(myMatches.set(user));
            this.store.dispatch(newPendingMatch.delete(user));
            Swal.fire('¡Solicitud aceptada!', '', 'success');
            this.event.emit('match');
          },
          (err) => {
            Swal.fire('Error', err, 'error');
            console.log(
              '🚀 ~ file: header.component.ts:159 ~ HeaderComponent ~ aceptar ~ err:',
              err
            );
          }
        );
      }
    });
  }
  async eliminarSolicitud(user: Usuario) {
    Swal.fire({
      title: '¿Seguro quieres cancelar la solicitud?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      icon: 'warning',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await this.matchSrvc.rejectPendingMatch(
          user.id!.toString()
        );
        res.subscribe(
          (data) => {
            Swal.fire('¡Solicitud eliminada!', '', 'success');
            this.store.dispatch(newPendingMatch.delete(user));
            this.event.emit({ type: 'deleteRequest', user: user });
          },
          (err) => {
            console.log(
              '🚀 ~ file: header.component.ts:184 ~ HeaderComponent ~ eliminarSolicitud ~ err:',
              err
            );
          }
        );
      }
    });
  }

  openSideBarChat() {
    this.isOpenSideBarChat = !this.isOpenSideBarChat;
  }

  setUserChat(user: Usuario) {
    this.store.dispatch(userChat.set(user));
  }

  quitUserChat() {
    this.userChat = null;
  }

  verPerfil(user: Usuario) {
    this.route.navigate([`/user/${user.id}`]);
  }

  logOut() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    location.reload();
  }

  async eliminarNotificaciones() {
    this.notificaciones.forEach(async (notificacion: any) => {
      const res = await this.notifySrvc.deleteNotify(notificacion.id);
      res.subscribe(
        (data) => {
          this.store.dispatch(newNotification.delete(notificacion));
        },
        (err) => {
          console.log(
            '🚀 ~ file: header.component.ts:221 ~ HeaderComponent ~ this.notificaciones.forEach ~ err:',
            err
          );
        }
      );
    });
  }

  async eliminarNotificacion(notificacion: any) {
    const res = await this.notifySrvc.deleteNotify(notificacion.id);
    res.subscribe(
      (data) => {
        this.store.dispatch(newNotification.delete(notificacion));
      },
      (err) => {
        console.log(
          '🚀 ~ file: header.component.ts:234 ~ HeaderComponent ~ eliminarNotificacion ~ err:',
          err
        );
      }
    );
  }

  getMessagesNoLeidos(userId: number): Number {
    return this.misMensajesNoVistos.filter(
      (item: any) => item.remitente_id === userId
    ).length;
  }

  closeSidebarLeft() {
    //remove the class lg-menu-open
    $('#sidebar-left').removeClass('lg-menu-open');
    $('#wrapper').removeClass('open');
  }

  organizarChats(mensajes: Chat[]) {
    const chats = this.misMatchesChat.slice();

    mensajes.forEach((mensaje: Chat) => {
      const index = chats.findIndex(
        (usuario: Usuario) => usuario.id === mensaje.remitente_id
      );
      if (index >= 0) {
        const user = chats[index];

        chats.splice(index, 1);
        chats.unshift(user);
      }
    });
    this.misMatchesChat = chats;
  }

  organizarChatsDesdeRemitente(mensajes: Chat[]) {
    const chats = this.misMatchesChat.slice();

    mensajes.forEach((mensaje: Chat) => {
      const index = chats.findIndex(
        (usuario: Usuario) => usuario.id === mensaje.destinatario_id
      );
      if (index >= 0) {
        const user = chats[index];

        chats.splice(index, 1);
        chats.unshift(user);
      } else {
      }
    });
    this.misMatchesChat = chats;
  }
}
