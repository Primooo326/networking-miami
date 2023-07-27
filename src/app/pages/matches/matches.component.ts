import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/tools/models';
import { UserService } from '../../services/user/user.service';
import { MatchService } from '../../services/match/match.service';
import { FormControl, Validators } from '@angular/forms';
import * as Masonry from 'masonry-layout';
import { Store } from '@ngrx/store';
import { matchSelect, userSelect } from 'src/redux/selectors';
import Swal from 'sweetalert2';
import { MailService } from 'src/app/services/mail/mail.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss'],
})
export class MatchesComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('user')!);
  onVerifyEmail = false;

  currentPage = 1;
  usersMatches: any[] = [];
  pages: number[] = [];
  showUsers: any[] = [];
  filterInput = new FormControl('', Validators.required);
  misMatches$ = this.store.select(matchSelect);
  verificado = false;
  constructor(
    private matchSrvc: MatchService,
    private store: Store<any>,
    private mailSrvc: MailService
  ) {}
  async ngOnInit() {
    this.misMatches$.subscribe((data: any) => {
      this.usersMatches = data;
      this.changePageMisMatches(0);
    });
    const misMatches = await this.matchSrvc.readMatch();
    misMatches.subscribe(
      (data: any) => {
        this.usersMatches = data;
        this.changePageMisMatches(0);
      },
      (err) => {
        console.log(err);
      }
    );
    this.store.select(userSelect).subscribe((data) => {
      data.verificado == 0
        ? (this.verificado = false)
        : (this.verificado = true);
    });
  }

  async verifyEmail() {
    this.onVerifyEmail = true;
    const res = await this.mailSrvc.verifyEmail({
      email: this.currentUser.email,
    });
    res.subscribe(
      (data) => {
        console.log(data);
        this.onVerifyEmail = false;
        Swal.fire(
          'Correo reenviado',
          `Se ha reenviado un correo a ${this.currentUser.email}. Acéptalo y verifica tu cuenta`,
          'success'
        );
      },
      (err) => {
        Swal.fire('error', err.error, 'error');
        this.onVerifyEmail = false;
      }
    );
  }
  changePageMisMatches(page: number) {
    this.currentPage = page;
    this.showUsers = this.usersMatches.filter(() => true);
    this.showUsers = this.showUsers.splice(page * 20, 20);
    this.initMasonry();
  }

  canNextPageMisMatches(): Boolean {
    const items = this.usersMatches.filter(() => true);
    const page = this.currentPage + 1;
    return items.splice(page * 20, 20).length == 0;
  }

  onChangeEvent(e: any) {
    console.log(e);
    this.ngOnInit();
  }
  initMasonry() {
    setTimeout(() => {
      var grid = document.querySelector('.rowmsry');
      new Masonry(grid!, {
        itemSelector: '.colmsry',
        gutter: 0,
        resize: true,
        initLayout: true,
        transitionDuration: '0.2s',
        stagger: 0,
        percentPosition: true,
        horizontalOrder: true,
        originLeft: true,
        originTop: true,
      });
    }, 100);
  }
}
