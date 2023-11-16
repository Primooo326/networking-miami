import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { SocketService } from './services/socket/socket.service';
import * as bootstrap from 'bootstrap';
import { Store } from '@ngrx/store';
import { notificationSelect } from 'src/redux/selectors';
import { NotifyService } from './services/notify/notify.service';
import {
  newPendingMatch,
  newNotification,
  myRequestMatches,
  myMatches,
  myMessages,
  setUser,
} from 'src/redux/actions';
import { MatchService } from './services/match/match.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ChatService } from './services/chat/chat.service';
import { UserService } from './services/user/user.service';
import { Usuario, UsuarioWithLastChat, Chat } from './tools/models';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Networking-Miami | Home';
  notifications$ = this.store.select(notificationSelect);
  preloader = true;
  constructor(
    private location: Location,
    private dataSrvc: AuthService,
    private SocketSrvc: SocketService,
    private notifySrvc: NotifyService,
    private matchSrvc: MatchService,
    private chatSrvc: ChatService,
    private userSrvc: UserService,
    private route: Router,
    private store: Store<any>
  ) {
    this.location.onUrlChange(() => {
      this.isNavHome();
    });
  }

  async ngOnInit() {
    await this.dataSrvc.datas();
    if (localStorage.getItem('token')) {
      const getUser = await this.userSrvc.getUserById(
        JSON.parse(localStorage.getItem('user')!).id
      );
      getUser.subscribe(
        async (usuario: any) => {
          this.store.dispatch(setUser.set(usuario));
          this.SocketSrvc.openSocket();
          const notifiys = await this.notifySrvc.getNorifications();
          notifiys.subscribe((data: any) => {
            data.forEach((element: any) => {
              this.store.dispatch(
                newNotification.set({
                  data: element.data,
                  title: element.title,
                  message: element.message,
                  time: element.time,
                  id: element.id,
                })
              );
            });
          });
          const matchesPending = await this.matchSrvc.readPendingMatch();
          matchesPending.subscribe((data: any) => {
            data.forEach((element: any) => {
              this.store.dispatch(newPendingMatch.set(element));
            });
          });
          const matchesRequest = await this.matchSrvc.readrequestMatches();
          matchesRequest.subscribe((data: any) => {
            data.forEach((element: any) => {
              this.store.dispatch(myRequestMatches.set(element));
            });
          });
          await this.matchSrvc.readMatch().then(async (data: any) => {
            let listaUsuarios: UsuarioWithLastChat[] = [];

            for (const usuarioMatch of data) {
              const mensaje: any = await this.chatSrvc.getLastMessage(
                usuario.id!,
                usuarioMatch.id!
              );
              let user;
              if (mensaje) {
                user = {
                  ...usuarioMatch,
                  lastMessage: mensaje,
                };
              } else {
                user = {
                  ...usuarioMatch,
                  lastMessage: {
                    id: 0,
                    conversacion_id: 0,
                    remitente_id: 0,
                    destinatario_id: 0,
                    mensaje: '',
                    estado: '',
                    fecha_envio: '2020-10-31T14:49:08.000Z',
                  },
                };
              }
              listaUsuarios.push(user);
            }
            // ordenar por fecha

            listaUsuarios.sort(
              (a: UsuarioWithLastChat, b: UsuarioWithLastChat) => {
                return (
                  new Date(b.lastMessage.fecha_envio).getTime() -
                  new Date(a.lastMessage.fecha_envio).getTime()
                );
              }
            );

            listaUsuarios.forEach((element: UsuarioWithLastChat) => {
              this.store.dispatch(myMatches.set(element));
            });

            // this.store.dispatch(myMatches.set(element))
          });
          const messages = await this.chatSrvc.readChats();
          messages.subscribe((data: any) => {
            data.forEach((element: any) => {
              this.store.dispatch(myMessages.set(element));
            });
          });
        },
        (err) => {
          console.log(
            '🚀 ~ file: app.component.ts:141 ~ AppComponent ~ ngOnInit ~ err:',
            err
          );
          if (err.status == 401) {
            Swal.fire(
              'Su sesión ha expirado',
              'Por favor vuelve a iniciar sesión',
              'error'
            );
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            this.route.navigate(['/']);
          }
        }
      );
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      $('#preloader').fadeOut('slow', function () {
        $(this).remove();
      });
    }, 2000);
  }

  isNavHome(): boolean {
    return ['', '/login'].includes(this.location.path());
  }
}
