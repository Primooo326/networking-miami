import { Component, Input, OnInit } from '@angular/core';
import { UserData } from 'src/app/tools/models';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements  OnInit {


  @Input() user!:UserData ;

  constructor() {
  }

  ngOnInit(): void {

  }


}
