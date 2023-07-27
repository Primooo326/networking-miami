import {
	AfterViewInit,
	Component,
	EventEmitter,
	OnInit,
	Output,
} from "@angular/core"
import { Location } from "@angular/common"
import { EPages, Usuario } from "src/app/tools/models"
import { Router } from "@angular/router"
import { Store } from "@ngrx/store"
import {
	userSelect,
	matchPendingSelect,
	notificationSelect,
	matchSelect,
	messagesSelect,
} from "src/redux/selectors"
import Swal from "sweetalert2"
import { MatchService } from "src/app/services/match/match.service"
import { myMatches, newNotification, newPendingMatch } from "src/redux/actions"
import { NotifyService } from "src/app/services/notify/notify.service"
import * as bootstrap from "bootstrap"

@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, AfterViewInit {
	page: EPages = EPages.landing
	user$ = this.store.select(userSelect)
	matchsRequest$ = this.store.select(matchPendingSelect)
	misMatches$ = this.store.select(matchSelect)
	notification$ = this.store.select(notificationSelect)
	messages$ = this.store.select(messagesSelect)
	userChat!: Usuario | null
	isCloseChat = false
	isOpenSideBarChat = false
	notificaciones: any[] = []
	misMensajesNoVistos: any = []
	@Output() event = new EventEmitter()
	constructor(
		private locate: Location,
		private route: Router,
		private matchSrvc: MatchService,
		private notifySrvc: NotifyService,
		private store: Store<any>,
	) {
		this.locate.onUrlChange(() => {
			switch (this.locate.path()) {
				case "/home":
					this.page = EPages.home
					break
				case "/login":
					this.page = EPages.login
					break
				case "":
					this.page = EPages.landing
					break
				default:
					this.page = EPages.home
					break
			}
		})
	}
	ngOnInit(): void {
		this.notification$.subscribe((data: any) => {
			this.notificaciones = data
		})
		this.messages$.subscribe((data: any) => {
			this.misMensajesNoVistos = data.filter(
				(item: any) => item.estado === "no_visto",
			)
		})
    // this.misMatches$.subscribe((data)=>
    // console.log(data))
	}
	ngAfterViewInit(): void {}
	calcularTiempoTranscurrido(desde: string): string {
		const fechaActual = new Date()
		const fechaPasada = new Date(desde)
		const diferenciaMilisegundos = fechaActual.getTime() - fechaPasada.getTime()

		// Cálculo de las diferentes unidades de tiempo
		const segundos = Math.floor(diferenciaMilisegundos / 1000)
		const minutos = Math.floor(segundos / 60)
		const horas = Math.floor(minutos / 60)
		const dias = Math.floor(horas / 24)

		if (dias > 0) {
			return `Hace ${dias} día(s)`
		} else if (horas > 0) {
			return `Hace ${horas} hora(s)`
		} else if (minutos > 0) {
			return `Hace ${minutos} minuto(s)`
		} else {
			return `Hace unos segundos`
		}
	}

	async aceptar(user: Usuario) {
		Swal.fire({
			title: "¿Seguro quieres aceptar la solicitud?",
			showCancelButton: true,
			confirmButtonText: "Aceptar",
			cancelButtonText: "Cancelar",
      confirmButtonColor:"#28a745"
		}).then(async (result) => {
			if (result.isConfirmed) {
				const currentUser = JSON.parse(localStorage.getItem("user")!)
				const body = {
					idToMatch: user.id,
					idUser: currentUser.id,
				}
				const res = await this.matchSrvc.createMatch(body)
				res.subscribe(
					(data) => {
						this.store.dispatch(myMatches.set(user))
						this.store.dispatch(newPendingMatch.delete(user))
						Swal.fire("¡Solicitud aceptada!", "", "success")
						console.log(data)
						this.event.emit("match")
					},
					(err) => {
						Swal.fire("Error", err, "error")
						console.log("error::", err)
					},
				)
			}
		})
	}
	async eliminarSolictud(user: Usuario) {
		Swal.fire({
			title: "¿Seguro quieres cancelar la solicitud?",
			showCancelButton: true,
			confirmButtonText: "Aceptar",
			cancelButtonText: "Cancelar",
			icon: "warning",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const res = await this.matchSrvc.rejectPendingMatch(user.id.toString())
				res.subscribe(
					(data) => {
						Swal.fire("¡Solicitud eliminada!", "", "success")
						this.store.dispatch(newPendingMatch.delete(user))
						this.event.emit({ type: "deleteRequest", user: user })
					},
					(err) => {
						console.log("error::", err)
					},
				)
			}
		})
	}

	openSideBarChat() {
		this.isOpenSideBarChat = !this.isOpenSideBarChat
	}

	setUserChat(user: Usuario) {
		this.userChat = null
		setTimeout(() => {
      this.userChat = user
      this.isCloseChat = true
		}, 150)
	}
  quitUserChat(){
    console.log("quitUser");
    this.userChat = null
  }
	async verPerfil(user: Usuario) {
		localStorage.setItem("userToView", JSON.stringify(user))
		this.route.navigate(["/user"])
	}
	logOut() {
		localStorage.removeItem("user")
		localStorage.removeItem("token")
		location.reload()
	}
	async eliminarNotificaciones() {
		this.notificaciones.forEach(async (notificacion: any) => {
			const res = await this.notifySrvc.deleteNotify(notificacion.id)
			res.subscribe(
				(data) => {
					console.log(data)
					this.store.dispatch(newNotification.delete(notificacion))
				},
				(err) => {
					console.log("error::", err)
				},
			)
		})
	}
	getMessagesNoLeidos(userId: number): Number {
		return this.misMensajesNoVistos.filter(
			(item: any) => item.remitente_id === userId,
		).length
	}
}
