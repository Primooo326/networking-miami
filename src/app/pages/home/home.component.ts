import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { UserData } from 'src/app/tools/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  users:UserData[] = [];
  pages:number[] = [];
  showUsers:UserData[] = [];
  currentPage = 1;

constructor(private userSrvc:UserService){


}
async ngOnInit() {

  await this.userSrvc.readUsers().then((obs)=>obs.subscribe((data)=>{
    this.users = data as UserData[];
    console.log(this.users);
    this.users.length / 4

    while(this.pages.length < this.users.length / 4){
      this.pages.push(this.pages.length);
    }
    this.changePage(0)
  }))
}
changePage(page:number){
  this.currentPage = page;
  this.showUsers = this.users.filter(()=>true)
  this.showUsers = this.showUsers.splice(page*4,4);

}
}
