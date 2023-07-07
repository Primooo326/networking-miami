import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { EPages } from 'src/app/tools/models';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { userSelect, matchPendingSelect, notificationSelect } from 'src/redux/selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  page: EPages = EPages.landing;
  user$ = this.store.select(userSelect)
  matchsRequest$ = this.store.select(matchPendingSelect)
  notification$ = this.store.select(notificationSelect)

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
  ngOnInit(): void {

    this.notification$.subscribe((notification) => {
      console.log("new notify:",notification);
    }
    )

  }
  calcularTiempoTranscurrido(desde: string): string {
    const fechaActual = new Date();
    const fechaPasada = new Date(desde);
    const diferenciaMilisegundos = fechaActual.getTime() - fechaPasada.getTime();

    // Cálculo de las diferentes unidades de tiempo
    const segundos = Math.floor(diferenciaMilisegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) {
      return `Hace ${dias} día(s)`;
    } else if (horas > 0) {
      return `Hace ${horas} hora(s)`;
    } else if (minutos > 0) {
      return `Hace ${minutos} minuto(s)`;
    } else {
      return `Hace unos segundos`;
    }
  }
  logOut() {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    this.route.navigate(['/']);
  }
}
