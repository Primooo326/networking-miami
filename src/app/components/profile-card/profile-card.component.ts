import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MailService } from 'src/app/services/mail/mail.service';
import { MatchService } from 'src/app/services/match/match.service';
import { ETypePerfil, Usuario } from 'src/app/tools/models';
import { newPendingMatch, myMatches, userChat } from 'src/redux/actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent {
  @Input() user!: Usuario;
  @Input() typeProfile: ETypePerfil = 'desconocido';
  @Output() event = new EventEmitter();
  constructor(
    private matchSrvc: MatchService,
    private mailSrvc: MailService,
    private store: Store<any>,
    private route: Router
  ) {}

  async solicitar() {
    Swal.fire({
      title: '¿Seguro quieres conectar con este usuario?',
      showCancelButton: true,
      confirmButtonText: 'Conectar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const user = JSON.parse(localStorage.getItem('user')!);
        const body = {
          usuario_id: this.user.id,
          usuario_request: user,
        };

        Swal.fire('¡Solicitud enviada!', '', 'success');
        const res = await this.matchSrvc.requestMatch(body);
        res.subscribe(
          (data) => {
            this.event.emit({ type: 'matchRequest', user: this.user });
          },
          (err) => {
            Swal.fire('Error', err, 'error');
            console.log(
              '🚀 ~ file: profile-card.component.ts:49 ~ ProfileCardComponent ~ solicitar ~ err:',
              err
            );
          }
        );
        const res2 = await this.mailSrvc.sendNewContact({
          solicitante: user,
          receptor: this.user,
        });
        res2.subscribe(
          (data) => {},
          (err) => {
            console.log(
              '🚀 ~ file: profile-card.component.ts:60 ~ ProfileCardComponent ~ solicitar ~ err:',
              err
            );
          }
        );
      }
    });
  }

  async aceptar() {
    Swal.fire({
      title: '¿Seguro quieres aceptar la solicitud?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const user = JSON.parse(localStorage.getItem('user')!);
        const body = {
          idToMatch: this.user.id,
          idUser: user.id,
        };
        this;
        const res = await this.matchSrvc.createMatch(body);
        res.subscribe(
          (data) => {
            this.store.dispatch(myMatches.set(this.user));
            this.store.dispatch(newPendingMatch.delete(this.user));
            Swal.fire('¡Solicitud aceptada!', '', 'success');
            this.event.emit('match');
          },
          (err) => {
            Swal.fire('Error', err, 'error');
            console.log(
              '🚀 ~ file: profile-card.component.ts:92 ~ ProfileCardComponent ~ aceptar ~ err:',
              err
            );
          }
        );
      }
    });
  }

  async eliminarSolicitud(isClient: boolean) {
    Swal.fire({
      title: '¿Estas seguro quieres cancelar la solicitud?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      icon: 'warning',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = isClient
          ? await this.matchSrvc.rejectPendingMatch(this.user.id!.toString())
          : await this.matchSrvc.deleteRequestMatch(this.user.id!.toString());
        res.subscribe(
          (data) => {
            Swal.fire('¡Solicitud eliminada!', '', 'success');
            this.store.dispatch(newPendingMatch.delete(this.user));
            this.event.emit({ type: 'deleteRequest', user: this.user });
          },
          (err) => {
            console.log(
              '🚀 ~ file: profile-card.component.ts:118 ~ ProfileCardComponent ~ eliminarSolicitud ~ err:',
              err
            );
          }
        );
      }
    });
  }

  async eliminarMatch() {
    Swal.fire({
      title: '¿Estas seguro quieres eliminar al contacto? ' + this.user.nombre,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      icon: 'warning',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await this.matchSrvc.deleteMatch(this.user.id!.toString());
        res.subscribe(
          (data) => {
            Swal.fire('¡Contacto eliminado!', '', 'success');
            this.store.dispatch(myMatches.delete(this.user));
            this.event.emit({ type: 'deleteMatch', user: this.user });
          },
          (err) => {
            Swal.fire('¡Error!', err, 'error');
            console.log(
              '🚀 ~ file: profile-card.component.ts:143 ~ ProfileCardComponent ~ eliminarMatch ~ err:',
              err
            );
          }
        );
      }
    });
  }
  chat() {
    this.store.dispatch(userChat.set(this.user));
  }
  verPerfil() {
    this.route.navigate([`/user/${this.user.id}`]);
  }
}
