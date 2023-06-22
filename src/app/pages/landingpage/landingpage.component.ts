import { Component, OnInit } from '@angular/core';
import sal from 'sal.js';
@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
})
export class LandingpageComponent implements OnInit {
  ngOnInit() {
    sal();
  }
}
