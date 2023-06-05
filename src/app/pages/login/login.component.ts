import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import Swal from "sweetalert2";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
	hintErrorLength = "Min 8 characters required";
	hintErrorRequired = "Field required";
	hintErrorPassword = "Passwords must match";
	hintErrorEmail = "type an vaild email";
	isOnLogin = false;
	secondTabRegistro = true;

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

	constructor(private authSrvc: AuthService) {
		this.registroForm.valueChanges.subscribe(() => {
			console.log(this.emailRegistroValidator());
		});
	}

	async register() {
		if (this.registroForm) {
		}
	}

	async login() {
		if (this.loginForm.valid) {
			await this.authSrvc
				.login({
					email: this.loginForm.value.email,
					password: this.loginForm.value.password,
				})
				.then(
					(obs) => {
						obs.subscribe((data) => {
							console.log(data);
						});
					},
					(err) => {
						console.log(err);
						console.log(err.error);
						if (err.error == "Invalid password")
							Swal.fire(
								"Error: Invalid password",
								"Make sure your password is correct",
								"error",
							);
					},
				);
		}
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
	onChangeTabRegister() {
		this.secondTabRegistro = !this.secondTabRegistro;
	}
}
