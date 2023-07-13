import { Component, OnInit } from '@angular/core';
import sal from 'sal.js';
@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
})
export class LandingpageComponent implements OnInit {
  counterValue: number =0
  ngOnInit() {
    sal();
    this.startCounter()
  }
  startCounter() {
    const finalValue = 352398;
    let duration = 5000; // Duración de la animación en milisegundos
    const increment = Math.ceil(finalValue / (duration / 10));

    const intervalId = setInterval(() => {
      if (this.counterValue < finalValue) {
        this.counterValue += increment;
        if (this.counterValue > finalValue) {
          this.counterValue = finalValue;
        }
      } else {
        clearInterval(intervalId);
      }
    }, 10);
  }
}
