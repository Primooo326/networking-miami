import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { EPages } from 'src/app/tools/models';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  page: EPages = EPages.landing;

  constructor(private locate: Location) {
    this.locate.onUrlChange(() => {
      switch (this.locate.path()) {
        case '/home':
          this.page = EPages.home;
          break;
        case '/login':
          this.page = EPages.login;
          break;
        case '/verify':
          this.page = EPages.login;
          break;
        case '':
          this.page = EPages.landing;
          break;
        default:
          this.page = EPages.landing;
          break;
      }
    });
  }
}
