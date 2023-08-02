import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"
import { ETypePerfil, Usuario } from "src/app/tools/models"
import { Store } from "@ngrx/store"
import {
	matchPendingSelect,
	matchRequestSelect,
	matchSelect,
} from "src/redux/selectors"
import Swal from "sweetalert2"
import { MailService } from "src/app/services/mail/mail.service"
import { MatchService } from "src/app/services/match/match.service"
import { myMatches, myRequestMatches, newPendingMatch } from "src/redux/actions"
import { HeaderComponent } from "../header/header.component"
@Component({
	selector: "app-banner",
	templateUrl: "./banner.component.html",
	styleUrls: ["./banner.component.scss"],
})
export class BannerComponent implements OnInit {
	@Input() user!: Usuario
	@Input() canEdit: boolean = false
	@Output() isOnEdit = new EventEmitter<boolean>()
	misMatches: Usuario[] = []
	peticionesDeMatch: Usuario[] = []
	solicitudesDeMatch: Usuario[] = []

	constructor(
		private store: Store<any>,
		private matchSrvc: MatchService,
		private mailSrvc: MailService,
		private headerComponent: HeaderComponent,
	) {}
	ngOnInit(): void {
		console.log(this.user)
		this.store.select(matchSelect).subscribe((matches) => {
			this.misMatches = matches
			this.defineTypeProfile()
		})
		this.store.select(matchRequestSelect).subscribe((users: any) => {
			this.peticionesDeMatch = users
			this.defineTypeProfile()
		})
		this.store.select(matchPendingSelect).subscribe((users: any) => {
			this.solicitudesDeMatch = users
			this.defineTypeProfile()
		})
	}
	onEdit() {
		this.isOnEdit.emit(true)
	}

	defineTypeProfile(): ETypePerfil | "propio" {
		if (this.solicitudesDeMatch.find((s) => s.id == this.user.id)) {
			return "solicitud"
		} else if (this.peticionesDeMatch.find((s) => s.id == this.user.id)) {
			return "solicitante"
		} else if (this.misMatches.find((s) => s.id == this.user.id)) {
			return "contacto"
		} else if (this.user.id != JSON.parse(localStorage.getItem("user")!).id) {
			return "desconocido"
		} else {
			return "propio"
		}
	}

	async solicitar() {
		Swal.fire({
			title: "¿Seguro quieres conectar con este usuario?",
			showCancelButton: true,
			confirmButtonText: "Conectar",
			cancelButtonText: "Cancelar",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const user = JSON.parse(localStorage.getItem("user")!)
				const body = {
					usuario_id: this.user.id,
					usuario_request: user,
				}
				// this.socketSrvc.notifyEmitter(body, 'match')

				Swal.fire("¡Solicitud enviada!", "", "success")
				const res = await this.matchSrvc.requestMatch(body)
				res.subscribe(
					(data) => {
						console.log(data)
						this.store.dispatch(myRequestMatches.set(this.user))
						// this.event.emit({ type: "matchRequest", user: this.user })
					},
					(err) => {
						Swal.fire("Error", err, "error")
						console.log("error::", err)
					},
				)
				const res2 = await this.mailSrvc.sendNewContact({
					solicitante: user,
					receptor: this.user,
				})
				res2.subscribe(
					(data) => {
						console.log(data)
					},
					(err) => {
						console.log(err)
					},
				)
			}
		})
	}

	async aceptar() {
		Swal.fire({
			title: "¿Seguro quieres aceptar la solicitud?",
			showCancelButton: true,
			confirmButtonText: "Aceptar",
			cancelButtonText: "Cancelar",
			confirmButtonColor: "#28a745",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const user = JSON.parse(localStorage.getItem("user")!)
				const body = {
					idToMatch: this.user.id,
					idUser: user.id,
				}
				this
				const res = await this.matchSrvc.createMatch(body)
				res.subscribe(
					(data) => {
						this.store.dispatch(myMatches.set(this.user))
						this.store.dispatch(newPendingMatch.delete(this.user))
						Swal.fire("¡Solicitud aceptada!", "", "success")
						console.log(data)
						// this.event.emit("match")
					},
					(err) => {
						Swal.fire("Error", err, "error")
						console.log("error::", err)
					},
				)
			}
		})
	}

	async cancelarSolictud() {
		Swal.fire({
			title: "¿Estás seguro de que quieres cancelar la solicitud?",
			showCancelButton: true,
			confirmButtonText: "Aceptar",
			cancelButtonText: "Cancelar",
			icon: "warning",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const res = await this.matchSrvc.deleteRequestMatch(
					this.user.id.toString(),
				)
				res.subscribe(
					(data) => {
						Swal.fire("¡Solicitud eliminada!", "", "success")
						console.log(data)
						this.store.dispatch(myRequestMatches.delete(this.user))
					},
					(err) => {
						console.log("error::", err)
					},
				)
			}
		})
	}
	async rechazarSolictud() {
		Swal.fire({
			title: "¿Estás seguro de que quieres rechazar la solicitud?",
			showCancelButton: true,
			confirmButtonText: "Aceptar",
			cancelButtonText: "Cancelar",
			icon: "warning",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const res = await this.matchSrvc.rejectPendingMatch(
					this.user.id.toString(),
				)
				res.subscribe(
					(data) => {
						Swal.fire("¡Solicitud eliminada!", "", "success")
						console.log(data)
						this.store.dispatch(newPendingMatch.delete(this.user))
					},
					(err) => {
						console.log("error::", err)
					},
				)
			}
		})
	}

	async eliminarMatch() {
		Swal.fire({
			title: "¿Estas seguro quieres eliminar al contacto? " + this.user.nombre,
			showCancelButton: true,
			confirmButtonText: "Aceptar",
			cancelButtonText: "Cancelar",
			icon: "warning",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const res = await this.matchSrvc.deleteMatch(this.user.id.toString())
				res.subscribe(
					(data) => {
						Swal.fire("¡Contacto eliminado!", "", "success")
						console.log(data)
						this.store.dispatch(myMatches.delete(this.user))
					},
					(err) => {
						Swal.fire("¡Error!", err, "error")
						console.log("error::", err)
					},
				)
			}
		})
	}
	chat() {
		this.headerComponent.setUserChat(this.user)
	}
}
