import { Component, OnInit } from "@angular/core"
import { FormControl, FormGroup, Validators } from "@angular/forms"
import { Store } from "@ngrx/store"
import { MailService } from "src/app/services/mail/mail.service"
import { UserService } from "src/app/services/user/user.service"
import { setUser } from "src/redux/actions"
import { userSelect } from "src/redux/selectors"
import Swal from "sweetalert2"
import intlTelInput from "intl-tel-input"
import Datepicker from "@chenfengyuan/datepicker" // Import Datepicker class
import { Router } from "@angular/router"
import { AuthService } from "src/app/services/auth/auth.service"
import "select2"
@Component({
	selector: "app-settings",
	templateUrl: "./settings.component.html",
	styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
	idiomas = JSON.parse(localStorage.getItem("lenguajes")!).sort()
	experiencia = JSON.parse(localStorage.getItem("experiencia")!).sort()
	intereses = JSON.parse(localStorage.getItem("interes")!).sort()
	condados = JSON.parse(localStorage.getItem("condados")!).sort()
	conexiones = JSON.parse(localStorage.getItem("conexion")!).sort()
	recharge = true
	condadoSelected: { nombre: string; ciudades: string[] }
	ciudades: string[] = []
	TipoConexion: string[] = []

	user$ = this.store.select(userSelect)
	currentUser = JSON.parse(localStorage.getItem("user")!)
	itiInput: any
	onInformacionBasicaEdit = true
	onInteresesEdit = true
	onCambioPasswordEdit = true
	isOnResetPassword = false
	isOnLoadingEmail = false
	isOnInformacionBasicaLoading = false
	isOnInteresesLoading = false
	showPasswords = false
	infoBasicaForm = new FormGroup({
		nombre: new FormControl(this.currentUser.nombre, [
			Validators.required,
			Validators.minLength(3),
		]),
		telefono: new FormControl(this.currentUser.telefono, [
			Validators.required,
			Validators.minLength(8),
		]),
		condado: new FormControl(this.currentUser.condado, [Validators.required]),
		ciudad: new FormControl(this.currentUser.ciudad, [Validators.required]),
		lenguajes: new FormControl(this.currentUser.lenguajes, [
			Validators.required,
		]),
		fechaNacimiento: new FormControl(
			this.currentUser.fechaNacimiento.substring(0, 10),
			[Validators.required],
		),
		genero: new FormControl(this.currentUser.genero, [Validators.required]),
		biografia: new FormControl(this.currentUser.biografia, [
			Validators.required,
		]),
	})

	interesesFormGroup = new FormGroup({
		temasInteres: new FormControl(this.currentUser.temasInteres, [
			Validators.required,
		]),
		areaExperiencia: new FormControl(this.currentUser.areaExperiencia, [
			Validators.required,
		]),
	})

	passwordsFormGroup = new FormGroup({
		passwordActual: new FormControl("", [
			Validators.required,
			Validators.minLength(8),
		]),
		passwordNueva: new FormControl("", [
			Validators.required,
			Validators.minLength(8),
		]),
		passwordRepetida: new FormControl("", [
			Validators.required,
			Validators.minLength(8),
		]),
	})
	hintMinLength = "Mínimo 8 caracteres"
	hintRequired = "Este campo es requerido"
	hintPasswordNotMatch = "Las contraseñas no coinciden"
	hintPasswordIsSame = "La contraseña debe ser diferente a la actual"
	constructor(
		private userSrvc: UserService,
		private authSrvc: AuthService,
		private store: Store<any>,
		private router: Router,
	) {
		const idx = this.condados.findIndex(
			(c: any) => c.nombre === this.currentUser.condado,
		)
		this.ciudades = this.condados[idx].ciudades
		this.condadoSelected = this.condados[idx]
		this.TipoConexion = [...this.currentUser.tipoConexion]
	}

	ngOnInit(): void {
		this.onInputTel()

		$('[data-toggle="datepicker"]').datepicker({
			language: "es-ES",
			startDate: "1900",
			endDate: "2010",
			format: "yyyy-mm-dd",
			autoHide: true,
			date: this.currentUser.fechaNacimiento,
			autoPick: true,
		})

		$('[data-toggle="datepicker"]').on("pick.datepicker", (e: any) => {
			this.infoBasicaForm.controls.fechaNacimiento.setValue(e.date)
		})
	}

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.onInputTel()
			$('[data-toggle="datepicker"]').datepicker({
				language: "es-ES",
				startDate: "1900",
				endDate: "2010",
				format: "yyyy-mm-dd",
				autoHide: true,
				date: this.currentUser.fechaNacimiento,
				autoPick: true,
			})

			$('[data-toggle="datepicker"]').on("pick.datepicker", (e: any) => {
				console.log(e)
				this.infoBasicaForm.controls.fechaNacimiento.setValue(e.date)
			})
		}, 2000)
		$("#preloader").fadeOut("slow", function () {
			$(this).remove()
		})
	}

	onInputTel() {
		var inputIti: any = document.querySelector("#phone")
		this.itiInput = intlTelInput(inputIti, {
			utilsScript:
				"https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
			// allowDropdown: true,
			// separateDialCode: true,
			initialCountry: "auto",
			geoIpLookup: function (callback) {
				fetch("https://ipapi.co/json")
					.then(function (res) {
						return res.json()
					})
					.then(function (data) {
						callback(data.country_code)
					})
					.catch(function () {
						callback("us")
					})
			},
		})
		const iti: any = document.querySelector(".iti")
		iti.style.width = "100%"
	}

	onCondadoChange() {
		this.recharge = false
		console.log(this.ciudades)

		this.ciudades = this.ciudades.filter((c) => true)
	}

	onEditSection(section: string) {
		switch (section) {
			case "informacionBasica":
				this.onInformacionBasicaEdit = !this.onInformacionBasicaEdit
				if (!this.onInformacionBasicaEdit) {
					setTimeout(() => {
						// this.onInputTel()
					}, 100)
				}
				break
			case "intereses":
				this.onInteresesEdit = !this.onInteresesEdit
				break
			default:
				break
		}

		setTimeout(() => {
			$("select.select2").select2({
				theme: "classic",
				dropdownAutoWidth: true,
				width: "100%",
				minimumResultsForSearch: Infinity,
			})

			$("select#condado").val(this.infoBasicaForm.get("condado")?.value)

			$("select#condado").on("change", (e: any) => {
				const condado: any = $(e.target).val()
				this.infoBasicaForm.get("condado")?.setValue(condado)
				const idx = this.condados.findIndex((c: any) => c.nombre === condado)
				this.ciudades = this.condados[idx].ciudades
				this.condadoSelected = this.condados[idx]
				document.getElementById("boton")?.click()
			})

			$("select#ciudad").val(this.infoBasicaForm.get("ciudad")?.value)

			$("select#ciudad").on("change", (e: any) => {
				const ciudad: any = $(e.target).val()

				this.infoBasicaForm.get("ciudad")?.setValue(ciudad)
			})

			$("select#gender").on("change", (e: any) => {
				const genero: any = $(e.target).val()
				this.infoBasicaForm.get("genero")?.setValue(genero)
			})
		}, 5)
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

	showPasswordsFn() {
		this.showPasswords = !this.showPasswords
		const passwordActual: any = document.getElementById("passwordActual")
		const passwordNueva: any = document.getElementById("passwordNueva")
		const passwordRepetida: any = document.getElementById("passwordRepetida")
		if (this.showPasswords) {
			passwordActual!.type = "text"
			passwordNueva!.type = "text"
			passwordRepetida!.type = "text"
		} else {
			passwordActual!.type = "password"
			passwordNueva!.type = "password"
			passwordRepetida!.type = "password"
		}
	}

	async cambioInformacionBasica() {
		this.isOnInformacionBasicaLoading = true
		const regex = /'(.*?)'/
		const user: any = { ...this.currentUser }
		let idiomaValue: any = $("select#idioma").val()
		idiomaValue = idiomaValue.map((i: string) => {
			const match = i.match(regex)
			return match ? match[1] : i
		})

		user.nombre = this.infoBasicaForm.get("nombre")?.value
		user.telefono = this.infoBasicaForm.get("telefono")?.value
		user.condado = this.infoBasicaForm.get("condado")?.value
		user.ciudad = this.infoBasicaForm.get("ciudad")?.value
		user.lenguajes = idiomaValue
		const date: any = $('[data-toggle="datepicker"]').datepicker("getDate")
		user.fechaNacimiento = new Date(date).toISOString()
		user.genero = this.infoBasicaForm.get("genero")?.value
		user.biografia = this.infoBasicaForm.get("biografia")?.value

		var number = this.itiInput.getNumber()
		user.telefono = number
		console.log(user)

		const res = await this.userSrvc.updateUser(user)
		res.subscribe(
			(data) => {
				console.log(data)
				this.isOnInformacionBasicaLoading = false
				this.currentUser = user
				this.store.dispatch(setUser.set(user))
				this.onInformacionBasicaEdit = true
			},
			(err) => {
				Swal.fire("error", err.error, "error")
				this.isOnInformacionBasicaLoading = false
			},
		)
	}

	async cambioIntereses() {
		this.isOnInteresesLoading = true
		const regex = /'(.*?)'/
		const user = { ...this.currentUser }
		console.log(user)
		user.tipoConexion = this.TipoConexion.filter((c) => true)
		let temasInteres: any = $("select#interes").val()
		temasInteres = temasInteres.map((i: string) => {
			const match = i.match(regex)
			return match ? match[1] : i
		})
		let areaExperiencia: any = $("select#experiencia").val()
		areaExperiencia = areaExperiencia.map((i: string) => {
			const match = i.match(regex)
			return match ? match[1] : i
		})
		user.temasInteres = temasInteres
		user.areaExperiencia = areaExperiencia
		console.log(user)
		const res = await this.userSrvc.updateUser(user)
		res.subscribe(
			(data) => {
				console.log(data)
				this.isOnInteresesLoading = false
				this.currentUser = user
				this.store.dispatch(setUser.set(user))
				this.onInteresesEdit = true
				this.interesesFormGroup.get("temasInteres")?.setValue(user.temasInteres)
				this.interesesFormGroup
					.get("areaExperiencia")
					?.setValue(user.areaExperiencia)
			},
			(err) => {
				Swal.fire("error", err.error, "error")
				this.isOnInteresesLoading = false
			},
		)
	}

	async cambioPassword() {
		this.isOnResetPassword = true

		const data = {
			id: this.currentUser.id,
			passwordActual: this.passwordsFormGroup.get("passwordActual")?.value,
			passwordNueva: this.passwordsFormGroup.get("passwordNueva")?.value,
		}

		const res = await this.authSrvc.changePassword(data)
		res.subscribe(
			(data) => {
				console.log(data)
				Swal.fire("Contraseña actualizada", "", "success")
				this.isOnResetPassword = false
				this.passwordsFormGroup.reset()
				this.onCambioPasswordEdit = true
			},
			(err) => {
				console.log(err)
				this.isOnResetPassword = false
				Swal.fire("Error", err.error, "error")
			},
		)
	}
	async deleteAccount() {
		Swal.fire({
			title: "¿Estás seguro de eliminar tu cuenta?",
			text: "Esta acción no se puede revertir",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Eliminar",
			cancelButtonText: "Cancelar",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const res = await this.userSrvc.deleteUser(this.currentUser.id)
				res.subscribe(
					(data) => {
						console.log(data)
						Swal.fire("Eliminada", "Tu cuenta ha sido eliminada", "success")
						localStorage.removeItem("user")
						localStorage.removeItem("token")
						this.router.navigate(["/"])
					},
					(err) => {
						console.log(err)
						Swal.fire("Error", "No se pudo eliminar tu cuenta", "error")
					},
				)
			}
		})
	}
}
