import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	title = "networking-miami";

	constructor(private location: Location, private router: Router) {
		this.location.onUrlChange(() => {
			this.isNavHome();
		});
	}

	isNavHome(): boolean {
		return [""].includes(this.location.path());
	}
}
