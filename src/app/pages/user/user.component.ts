import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user = JSON.parse(localStorage.getItem('userToView')!);

  constructor() {}

  ngOnInit() {

  }
}
