import { AfterViewInit, Component } from "@angular/core"
import { FormControl, FormGroup, Validators } from "@angular/forms"
import { AuthService } from "src/app/services/auth.service"
import {
	ciudades,
	experiencia,
	idiomas,
	intereses,
} from "src/assets/datasets/datasets"
import Swal from "sweetalert2"

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements AfterViewInit {
	idiomas = idiomas
	experiencia = experiencia
	intereses = intereses
	ciudades = ciudades

	TipoConexion: string[] = []

	hintErrorLength = "Min 8 characters required"
	hintErrorRequired = "Field required"
	hintErrorPassword = "Passwords must match"
	hintErrorEmail = "type an valid email"

	isOnLogin = true
	tabRegistro = "primero"

	lenguajesV = true
	experienciaV = true
	interesesV = true

	registroForm1Tab = new FormGroup({
		email: new FormControl("juan@mail.com", [
			Validators.required,
			Validators.email,
		]),
		password: new FormControl("12345678", [
			Validators.required,
			Validators.minLength(8),
		]),
		repeatPassword: new FormControl("12345678", [
			Validators.required,
			Validators.minLength(8),
		]),
	})

	registroForm2Tab = new FormGroup({
		name: new FormControl("", [Validators.required, Validators.minLength(8)]),
		birthdate: new FormControl("", [Validators.required]),
		phone: new FormControl("", [Validators.required, Validators.minLength(8)]),
		gender: new FormControl("", [Validators.required]),
		city: new FormControl("", [Validators.required]),
		languages: new FormControl(""),
		biography: new FormControl("", [
			Validators.required,
			Validators.minLength(8),
		]),
	})

	registroForm3Tab = new FormGroup({
		areaExperiencia: new FormControl(""),
		temasInteres: new FormControl(""),
		objetivo: new FormControl("", [Validators.required]),
	})

	loginForm = new FormGroup({
		email: new FormControl("", [Validators.required, Validators.email]),
		password: new FormControl("", [
			Validators.required,
			Validators.minLength(8),
		]),
	})

	constructor(private authSrvc: AuthService) {
		setInterval(() => {
			this.experienciaV =
				this.registroForm3Tab.controls.areaExperiencia.value?.length == 0

			this.interesesV =
				this.registroForm3Tab.controls.temasInteres.value?.length == 0

			this.lenguajesV =
				this.registroForm2Tab.controls.languages.value?.length == 0
		}, 100)
	}

	ngAfterViewInit(): void {
		$("select.select2").select2({
			theme: "classic",
			dropdownAutoWidth: true,
			width: "100%",
			minimumResultsForSearch: Infinity,
		})
		$("select#ciudad").on("change", (e) => {
			const ciudad: any = $(e.target).val()
			this.registroForm2Tab.get("city")?.setValue(ciudad)
		})
		$("select#idioma").on("change", (e) => {
			const languages: any = $(e.target).val()
			this.registroForm2Tab.get("languages")?.setValue(languages)
		})
		$("select#gender").on("change", (e) => {
			const gender: any = $(e.target).val()
			this.registroForm2Tab.get("gender")?.setValue(gender)
		})
		$("select#experiencia").on("change", (e) => {
			const experiencia: any = $(e.target).val()
			this.registroForm3Tab.get("areaExperiencia")?.setValue(experiencia)
		})
		$("select#interes").on("change", (e) => {
			const temasInteres: any = $(e.target).val()
			this.registroForm3Tab.get("temasInteres")?.setValue(temasInteres)
		})
	}

	async login() {
		if (this.loginForm.valid) {
			await this.authSrvc
				.login({
					email: this.loginForm.value.email,
					password: this.loginForm.value.password,
				})
				.then((obs) => {
					obs.subscribe(
						(data) => {
							console.log(data)
							localStorage.setItem("session", JSON.stringify(data))
						},
						(err) => {
							console.log(err)
							if (err.error == "Invalid password") {
								Swal.fire(
									"Error: Invalid password",
									"Make sure your password is correct",
									"error",
								)
							} else if (err.error == "User does not exist") {
								Swal.fire(
									"Error: User does not exist",
									"Make sure your email is correct",
									"error",
								)
							} else {
								Swal.fire("Error", err.message, "error")
							}
						},
					)
				})
		}
	}
	async register(registro3Value: any) {
		const newUser: any = {
			...this.registroForm1Tab.value,
			...this.registroForm2Tab.value,
			...registro3Value,
		}
		await this.authSrvc.register(newUser).then(
			(obs) => {
				obs.subscribe(
					(data: any) => {
						console.log(data)
						localStorage.setItem("session", JSON.stringify(data))
					},
					(err: any) => {
						if (err.error == "User already registered") {
							Swal.fire(
								"Error: User already registered",
								"Make sure your email is correct",
								"error",
							)
						} else {
							Swal.fire("Error", err.message, "error")
						}
					},
				)
			},
			(err) => {
				console.log(err)
			},
		)

		console.log(newUser)
	}

	register1Tab() {
		console.log(this.registroForm1Tab.value)
		this.onChangeTabRegister("segundo")
	}
	register2Tab() {
		console.log(this.registroForm2Tab.value)
		this.onChangeTabRegister("tercero")
	}
	register3Tab() {
		const registro3Value: any = this.registroForm3Tab.value
		registro3Value.tipoConexion = this.TipoConexion
		console.log(registro3Value)
		this.register(registro3Value)
	}

	onChangeTabRegister(tab: string) {
		this.tabRegistro = tab
	}
	onChangeConexiones(data: any) {
		const value = data.target.value
		console.log(value)
		if (this.TipoConexion.includes(value)) {
			const idx = this.TipoConexion.findIndex((d) => d == value)
			this.TipoConexion.splice(idx, 1)
		} else {
			this.TipoConexion.push(value)
		}
		console.log(this.TipoConexion)
	}

	//!Validadores

	emailLoginValidator(): boolean {
		return (
			this.registroForm1Tab.controls.email.hasError("required") ||
			this.registroForm1Tab.controls.email.hasError("email")
		)
	}
	passwordLoginValidator(): boolean {
		return (
			this.registroForm1Tab.controls.password.hasError("required") ||
			this.registroForm1Tab.controls.password.hasError("minlength") ||
			this.registroForm1Tab.controls.password.value !==
				this.registroForm1Tab.controls.repeatPassword.value
		)
	}

	emailRegistroValidator(): boolean {
		return (
			this.registroForm1Tab.controls.email.hasError("required") ||
			this.registroForm1Tab.controls.email.hasError("email")
		)
	}
	passwordRegistroValidator(): boolean {
		return (
			this.registroForm1Tab.controls.password.hasError("required") ||
			this.registroForm1Tab.controls.password.hasError("minlength") ||
			this.registroForm1Tab.controls.password.value !==
				this.registroForm1Tab.controls.repeatPassword.value
		)
	}
	nameRegistroValidator(): boolean {
		return (
			this.registroForm2Tab.controls.name.hasError("required") ||
			this.registroForm2Tab.controls.name.hasError("minlength")
		)
	}
	phoneRegistroValidator(): boolean {
		return (
			this.registroForm2Tab.controls.phone.hasError("required") ||
			this.registroForm2Tab.controls.phone.hasError("minlength")
		)
	}
	birthdateRegistroValidator(): boolean {
		return this.registroForm2Tab.controls.birthdate.hasError("required")
	}
	genderRegistroValidator(): boolean {
		return this.registroForm2Tab.controls.gender.hasError("required")
	}
	cityRegistroValidator(): boolean {
		return this.registroForm2Tab.controls.city.hasError("required")
	}
	languagesRegistroValidator() {
		this.lenguajesV =
			this.registroForm2Tab.controls.languages.value?.length == 0
		console.log(this.lenguajesV)
	}
	biographyRegistroValidator(): boolean {
		return this.registroForm2Tab.controls.biography.hasError("required")
	}
}