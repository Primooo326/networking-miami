import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { EPages } from 'src/app/tools/models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  page: EPages = EPages.landing;

  currentUser: any;

  constructor(private locate: Location) {
    this.locate.onUrlChange(() => {
      switch (this.locate.path()) {
        case '/home':
          this.currentUser = JSON.parse(localStorage.getItem('session')!);
          console.log(this.currentUser);
          this.page = EPages.home;
          break;
        case '/login':
          this.page = EPages.login;
          break;
        case '':
          this.page = EPages.landing;
          break;
        default:
          this.currentUser = JSON.parse(localStorage.getItem('session')!);
          this.page = EPages.home;
          break;
      }
    });
  }
}
