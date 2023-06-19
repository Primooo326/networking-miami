import { Component, OnInit } from '@angular/core';
import { MailService } from 'src/app/services/mail/mail.service';
import { UserService } from 'src/app/services/user/user.service';
import { UserData } from 'src/app/tools/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  users: UserData[] = [];
  pages: number[] = [];
  showUsers: UserData[] = [];
  verificado = false;
  onVerifyEmail = false;
  currentPage = 1;
  currentUser = JSON.parse(localStorage.getItem('session')!);
  constructor(private userSrvc: UserService, private mailSrvc: MailService) {}
  async ngOnInit() {
    const { user } = this.currentUser;
    user.verificado == 0 ? (this.verificado = false) : (this.verificado = true);

    await this.userSrvc.readUsers().then((obs) =>
      obs.subscribe((data) => {
        this.users = data as UserData[];
        this.users.length / 4;

        while (this.pages.length < this.users.length / 4) {
          this.pages.push(this.pages.length);
        }
        this.changePage(0);
      })
    );
  }
  changePage(page: number) {
    this.currentPage = page;
    this.showUsers = this.users.filter(() => true);
    this.showUsers = this.showUsers.splice(page * 4, 4);
  }
  async verifyEmail() {
    this.onVerifyEmail = true;
    const res = await this.mailSrvc.verifyEmail({
      email: this.currentUser.user.email,
    });
    res.subscribe(
      (data) => {
        console.log(data);
        this.onVerifyEmail = false;
      },
      (err) => {
        Swal.fire('error', err.error, 'error');
        this.onVerifyEmail = false;
      }
    );
  }
}
