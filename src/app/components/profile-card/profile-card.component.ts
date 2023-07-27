import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatchService } from 'src/app/services/match/match.service';
import { ETypePerfil, Usuario } from 'src/app/tools/models';
import { newPendingMatch, myMatches } from 'src/redux/actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent implements OnInit {
  @Input() user!: Usuario;
  @Input() typeProfile: ETypePerfil = 'desconocido';
  @Output() event = new EventEmitter();
  constructor(
    private matchSrvc: MatchService,
    private store: Store<any>,
    private route: Router
  ) {}

  ngOnInit(): void {}

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
        // this.socketSrvc.notifyEmitter(body, 'match')

        Swal.fire('¡Solicitud enviada!', '', 'success');
        const res = await this.matchSrvc.requestMatch(body);
        res.subscribe(
          (data) => {
            console.log(data);
            this.event.emit({ type: 'matchRequest', user: this.user });
          },
          (err) => {
            Swal.fire('Error', err, 'error');
            console.log('error::', err);
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
      confirmButtonColor:"#28a745"

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

  async eliminarSolictud(isClient: boolean) {
    Swal.fire({
      title: '¿Estas seguro quieres cancelar la solicitud?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      icon: 'warning',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = isClient
          ? await this.matchSrvc.rejectPendingMatch(this.user.id.toString())
          : await this.matchSrvc.deleteRequestMatch(this.user.id.toString());
        res.subscribe(
          (data) => {
            Swal.fire('¡Solicitud eliminada!', '', 'success');
            console.log(data);
            this.store.dispatch(newPendingMatch.delete(this.user));
            this.event.emit({ type: 'deleteRequest', user: this.user });
          },
          (err) => {
            console.log('error::', err);
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
        const res = await this.matchSrvc.deleteMatch(this.user.id.toString());
        res.subscribe(
          (data) => {
            Swal.fire('¡Contacto eliminado!', '', 'success');
            console.log(data);
            this.store.dispatch(myMatches.delete(this.user));
            this.event.emit({ type: 'deleteMatch', user: this.user });
          },
          (err) => {
            Swal.fire('¡Error!', err, 'error');
            console.log('error::', err);
          }
        );
      }
    });
  }

  async verPerfil() {
    localStorage.setItem('userToView', JSON.stringify(this.user));
    this.route.navigate(['/user']);
  }
}
