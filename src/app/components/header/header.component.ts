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
  currentUser: any;

  constructor(private locate: Location, private route: Router, private store:Store<any>) {
    console.log(JSON.parse(localStorage.getItem('session')!).user);
    this.locate.onUrlChange(() => {
      switch (this.locate.path()) {
        case '/home':
          this.currentUser = JSON.parse(localStorage.getItem('session')!);
          this.page = EPages.home;
          this.user$.subscribe((user)=>{
            console.log(user);
          })
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

  logOut() {
    localStorage.clear();
    this.route.navigate(['/']);
  }
}
