import { Component } from "@angular/core"
import { FormControl, FormGroup, Validators } from "@angular/forms"
import { AuthService } from "src/app/services/auth/auth.service"
import { MailService } from "src/app/services/mail/mail.service"
import { UserService } from "src/app/services/user/user.service"
import {
	condados,
	idiomas,
	intereses,
	conexiones,
} from "src/assets/datasets/datasets"
import Swal from "sweetalert2"
@Component({
	selector: "app-profile-settings",
	templateUrl: "./profile-settings.component.html",
	styleUrls: ["./profile-settings.component.scss"],
})
export class ProfileSettingsComponent {
	condados = condados
	idiomas = idiomas
	conexiones = conexiones
	intereses = intereses
	recharge = true
	condadoSelected: { nombre: string; ciudades: string[] }
	ciudades: string[] = []
	TipoConexion: string[] = []

	currentUser = JSON.parse(localStorage.getItem("session")!)
	onInformacionBasicaEdit = true
	onInteresesEdit = true
	onzonarojaEdit = true
	isOnResetPassword = false
	isOnLoadingEmail = false
	isOnInformacionBasicaLoading = false
	isOnInteresesLoading = false
	infoBasicaForm = new FormGroup({
		nombre: new FormControl(this.currentUser.user.nombre, [
			Validators.required,
			Validators.minLength(3),
		]),
		telefono: new FormControl(this.currentUser.user.telefono, [
			Validators.required,
			Validators.minLength(8),
		]),
		condado: new FormControl(this.currentUser.user.condado, [
			Validators.required,
		]),
		ciudad: new FormControl(this.currentUser.user.ciudad, [
			Validators.required,
		]),
		lenguajes: new FormControl(this.currentUser.user.lenguajes, [
			Validators.required,
		]),
		fechaNacimiento: new FormControl(
			this.currentUser.user.fechaNacimiento.substring(0, 10),
			[Validators.required],
		),
		genero: new FormControl(this.currentUser.user.genero, [
			Validators.required,
		]),
		biografia: new FormControl(this.currentUser.user.biografia, [
			Validators.required,
		]),
	})

	interesesForm = new FormControl(this.currentUser.user.temasInteres, [
		Validators.required,
	])

	newEmail = new FormControl(this.currentUser.user.email, [
		Validators.required,
		Validators.email,
	])
	constructor(private mailSrvc: MailService, private userSrvc: UserService) {
		console.log(this.currentUser.user)

		const idx = this.condados.findIndex(
			(c) => c.nombre === this.currentUser.user.condado,
		)
		this.ciudades = this.condados[idx].ciudades
		this.condadoSelected = this.condados[idx]
		this.TipoConexion = [...this.currentUser.user.tipoConexion]
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
				break
			case "intereses":
				this.onInteresesEdit = !this.onInteresesEdit
				break
			case "zonaroja":
				this.onzonarojaEdit = !this.onzonarojaEdit
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
				const idx = this.condados.findIndex((c) => c.nombre === condado)
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
		}, 10)
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
	async cambioInformacionBasica() {
		const regex = /'(.*?)'/
		const user = { ...this.currentUser.user }
		let idiomaValue: any = $("select#idioma").val()
		idiomaValue = idiomaValue.map((i: string) => {
			const match = i.match(regex)
			return match ? match[1] : i
		})
		console.log(this.infoBasicaForm.get("fechaNacimiento")?.value)

		user.nombre = this.infoBasicaForm.get("nombre")?.value
		user.telefono = this.infoBasicaForm.get("telefono")?.value
		user.condado = this.infoBasicaForm.get("condado")?.value
		user.ciudad = this.infoBasicaForm.get("ciudad")?.value
		user.lenguajes = idiomaValue
		user.fechaNacimiento = new Date(
			this.infoBasicaForm.get("fechaNacimiento")?.value,
		).toISOString()
		user.genero = this.infoBasicaForm.get("genero")?.value
		user.biografia = this.infoBasicaForm.get("biografia")?.value

		console.log(user)

		this.onInteresesEdit = true
		const res = await this.userSrvc.updateUser(user)
		res.subscribe(
			(data) => {
				console.log(data)
				this.onInteresesEdit = false
			},
			(err) => {
				Swal.fire("error", err.error, "error")
				this.onInteresesEdit = false
			},
		)
	}
	async cambioIntereses() {
		const regex = /'(.*?)'/
		const user = { ...this.currentUser.user }
		console.log(user)
		user.tipoConexion = this.TipoConexion
		let intereses: any = $("select#interes").val()
		user.temasInteres = intereses.map((i: string) => {
			const match = i.match(regex)
			return match ? match[1] : i
		})
		console.log(user)
		this.isOnInformacionBasicaLoading = true
		const res = await this.userSrvc.updateUser(user)
		res.subscribe(
			(data) => {
				console.log(data)
				this.isOnInformacionBasicaLoading = false
			},
			(err) => {
				Swal.fire("error", err.error, "error")
				this.isOnInformacionBasicaLoading = false
			},
		)
	}
	async cambioEmail() {
		const res = await this.mailSrvc.changeEmail({
			email: this.currentUser.user.email,
			newEmail: this.newEmail.value,
		})

		this.isOnLoadingEmail = true
		res.subscribe(
			(data) => {
				console.log(data)
				this.isOnLoadingEmail = false
			},
			(err) => {
				Swal.fire("error", err.error, "error")
				this.isOnLoadingEmail = false
			},
		)
	}
	async CambioPassword() {
		this.isOnResetPassword = true
		const res = await this.mailSrvc.resetPasswordEmail({
			email: this.currentUser.user.email,
		})
		res.subscribe(
			(data) => {
				console.log(data)
				this.isOnResetPassword = false
			},
			(err) => {
				Swal.fire("error", err.error, "error")
				this.isOnResetPassword = false
			},
		)
	}
}
