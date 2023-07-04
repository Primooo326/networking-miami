import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { SocketService } from './services/socket/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Networking-Miami | Home';

  constructor(
    private location: Location,
    private dataSrvc: AuthService,
    private SocketSrvc: SocketService
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
    }
  }

  isNavHome(): boolean {
    return [''].includes(this.location.path());
  }
}
