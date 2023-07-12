import { Component, OnInit } from '@angular/core';
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
} from 'src/redux/actions';
import { MatchService } from './services/match/match.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Networking-Miami | Home';
  notifications$ = this.store.select(notificationSelect);
  constructor(
    private location: Location,
    private dataSrvc: AuthService,
    private SocketSrvc: SocketService,
    private notifySrvc: NotifyService,
    private matchSrvc: MatchService,
    private store: Store<any>
  ) {
    this.location.onUrlChange(() => {
      this.isNavHome();
    });
  }

  async ngOnInit() {
    if (!localStorage.getItem('lenguajes')) {
      await this.dataSrvc.datas();
    }
    if (localStorage.getItem('token')) {
      this.SocketSrvc.openSocket();
      const notifiys = await this.notifySrvc.getNorifications();

      notifiys.subscribe(
        (data: any) => {
          console.log(data);
          data.forEach((element: any) => {
            this.store.dispatch(
              newNotification.set({
                data: element.data,
                title: element.title,
                message: element.message,
                time: element.time,
              })
            );
          });
        },
        (err: any) => {
          console.log(err);
        }
      );

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

      const matches = await this.matchSrvc.readMatch();
      matches.subscribe((data: any) => {
        console.log(data);
        data.forEach((element: any) => {
          this.store.dispatch(myMatches.set(element));
        });
      });
    }
  }

  isNavHome(): boolean {
    return [''].includes(this.location.path());
  }
}
