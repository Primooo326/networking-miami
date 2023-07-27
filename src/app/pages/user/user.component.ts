import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { Usuario } from 'src/app/tools/models';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user = JSON.parse(localStorage.getItem('userToView')!);

  currentUser:Usuario = JSON.parse(localStorage.getItem('user')!)
  isReady = false

  constructor(private userSrvc:UserService) {}

  async ngOnInit() {
    console.log(this.user);
    const getUser = await this.userSrvc.getUserById(this.user.id)

    getUser.subscribe((data:any)=>{
      console.log(data);
      this.currentUser = data
      setTimeout(() => {

        this.isReady = true
      }, 1000);
    }, (err)=>{
      console.log(err);
    })

  }
}
