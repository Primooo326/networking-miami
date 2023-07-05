import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { SocketService } from './services/socket/socket.service';
import * as bootstrap from 'bootstrap';
import { Store } from '@ngrx/store';
import { notificationSelect } from 'src/redux/selectors';
import { NotifyService } from './services/notify/notify.service';
import { newMatchRequest, newNotification } from 'src/redux/actions';
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
    private notifySrvc:NotifyService,
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
    if(localStorage.getItem('token')){
      this.SocketSrvc.openSocket();
      const notifiys =await  this.notifySrvc.getNorifications()

      notifiys.subscribe((data:any)=>{
        console.log(data);
        data.forEach((element:any) => {
          this.store.dispatch(newNotification.set({data: element.data, title: element.title, message:element.message, time: element.time}))
          if(element.type = "match"){
            this.store.dispatch(newMatchRequest.set(element.data))
          }
        })
      }
      )

    }

  }

  isNavHome(): boolean {
    return [''].includes(this.location.path());
  }
}
