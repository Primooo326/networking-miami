import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { AuthService } from "./services/auth/auth.service";
@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
	title = "Networking-Miami | Home";

	constructor(private location: Location, private router: Router, private dataSrvc:AuthService) {
		this.location.onUrlChange(() => {
			this.isNavHome();
		});
	}

  async ngOnInit() {
    await this.dataSrvc.datas();
  }

	isNavHome(): boolean {
		return [""].includes(this.location.path());
	}
}
