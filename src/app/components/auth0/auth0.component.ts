import { Component } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";

@Component({
	selector: "app-auth0",
	templateUrl: "./auth0.component.html",
	styleUrls: ["./auth0.component.scss"],
})
export class Auth0Component {
	constructor(public auth: AuthService) {}
}
