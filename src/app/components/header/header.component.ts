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
import { EPages, Usuario } from 'src/app/tools/models';
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
  matchsRequest$ = this.store.select(matchPendingSelect);
  misMatches$ = this.store.select(matchSelect);
  misMatchesChat: any[] = [];
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
  ngOnInit(): void {
    this.notification$.subscribe((data: any) => {
      this.notificaciones = data;
    });
    this.misMatches$.subscribe((data) => {
      this.misMatchesChat = data;
      console.log(data);
    });
    this.messages$.subscribe((data: any) => {
      console.log(data);
      this.misMensajesNoVistos = data.filter(
        (item: any) => item.estado === 'no_visto'
      );
      this.organizarChats(data);
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
            this.store.dispatch(myMatches.set(user));
            this.store.dispatch(newPendingMatch.delete(user));
            Swal.fire('¡Solicitud aceptada!', '', 'success');
            console.log(data);
            this.event.emit('match');
          },
          (err) => {
            Swal.fire('Error', err, 'error');
            console.log('error::', err);
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
        const res = await this.matchSrvc.rejectPendingMatch(user.id.toString());
        res.subscribe(
          (data) => {
            Swal.fire('¡Solicitud eliminada!', '', 'success');
            this.store.dispatch(newPendingMatch.delete(user));
            this.event.emit({ type: 'deleteRequest', user: user });
          },
          (err) => {
            console.log('error::', err);
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
    console.log('quitUser');
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
          console.log(data);
          this.store.dispatch(newNotification.delete(notificacion));
        },
        (err) => {
          console.log('error::', err);
        }
      );
    });
  }

  async eliminarNotificacion(notificacion: any) {
    const res = await this.notifySrvc.deleteNotify(notificacion.id);
    res.subscribe(
      (data) => {
        console.log(data);
        this.store.dispatch(newNotification.delete(notificacion));
      },
      (err) => {
        console.log('error::', err);
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

  organizarChats(data: any[]) {
    // this.misMatchesChat.sort((a: any, b: any) => {
    //   return (
    //     new Date(b.fecha_envio).getTime() - new Date(a.fecha_envio).getTime()
    //   );
    // });
  }
}
