import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { EPages } from 'src/app/tools/models';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { userSelect } from 'src/redux/selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  page: EPages = EPages.landing;
  user$ = this.store.select(userSelect)

  constructor(private locate: Location, private route: Router, private store:Store<any>) {
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

  logOut() {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    this.route.navigate(['/']);
  }
}
