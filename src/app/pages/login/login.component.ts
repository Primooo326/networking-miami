import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
	hintErrorLength = "Min 8 characters required";
	hintErrorRequired = "Field required";
	hintErrorPassword = "Passwords must match";

	isOnLogin = false;

	registroForm = new FormGroup({
		email: new FormControl("", [Validators.required, Validators.email]),
		password: new FormControl("", [
			Validators.required,
			Validators.minLength(8),
		]),
		repeatPassword: new FormControl("", [
			Validators.required,
			Validators.minLength(8),
		]),
	});

	loginForm = new FormGroup({
		email: new FormControl("", [Validators.required, Validators.email]),
		password: new FormControl("", [
			Validators.required,
			Validators.minLength(8),
		]),
	});

	constructor() {
		this.registroForm.valueChanges.subscribe(() => {
			console.log(this.emailRegistroValidator());
		});
	}

	emailLoginValidator(): boolean {
		return (
			this.registroForm.controls.email.hasError("required") ||
			this.registroForm.controls.email.hasError("email")
		);
	}
	passwordLoginValidator(): boolean {
		return (
			this.registroForm.controls.password.hasError("required") ||
			this.registroForm.controls.password.hasError("minlength") ||
			this.registroForm.controls.password.value !==
				this.registroForm.controls.repeatPassword.value
		);
	}
	emailRegistroValidator(): boolean {
		return (
			this.registroForm.controls.email.hasError("required") ||
			this.registroForm.controls.email.hasError("email")
		);
	}
	passwordRegistroValidator(): boolean {
		return (
			this.registroForm.controls.password.hasError("required") ||
			this.registroForm.controls.password.hasError("minlength") ||
			this.registroForm.controls.password.value !==
				this.registroForm.controls.repeatPassword.value
		);
	}
}
