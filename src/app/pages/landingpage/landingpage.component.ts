import { Component, OnInit } from '@angular/core';
import sal from 'sal.js';
import { UserService } from 'src/app/services/user/user.service';
@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
})
export class LandingpageComponent implements OnInit {
  constructor(private userSrvc: UserService) {}

  counterValue: number = 0;
  async ngOnInit() {

    const res = await this.userSrvc.readAllUsers()

    res.subscribe((data:any)=>{
      console.log(data)
      this.startCounter(data.length);
    })

    sal();
  }
  startCounter(users:number) {
    const finalValue = users + 300;
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
