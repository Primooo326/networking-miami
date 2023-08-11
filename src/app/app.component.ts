import { AfterViewInit, Component, OnInit } from "@angular/core"
import { Location } from "@angular/common"
import { AuthService } from "./services/auth/auth.service"
import { SocketService } from "./services/socket/socket.service"
import * as bootstrap from "bootstrap"
import { Store } from "@ngrx/store"
import { notificationSelect } from "src/redux/selectors"
import { NotifyService } from "./services/notify/notify.service"
import {
	newPendingMatch,
	newNotification,
	myRequestMatches,
	myMatches,
	myMessages,
	setUser,
} from "src/redux/actions"
import { MatchService } from "./services/match/match.service"
import Swal from "sweetalert2"
import { Router } from "@angular/router"
import { ChatService } from "./services/chat/chat.service"
import { UserService } from "./services/user/user.service"
@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, AfterViewInit {
	title = "Networking-Miami | Home"
	notifications$ = this.store.select(notificationSelect)
	preloader = true
	constructor(
		private location: Location,
		private dataSrvc: AuthService,
		private SocketSrvc: SocketService,
		private notifySrvc: NotifyService,
		private matchSrvc: MatchService,
		private chatSrvc: ChatService,
		private userSrvc: UserService,
		private route: Router,
		private store: Store<any>,
	) {
		this.location.onUrlChange(() => {
			this.isNavHome()
		})
	}

	async ngOnInit() {
		await this.dataSrvc.datas()
		if (localStorage.getItem("token")) {
			const getUser = await this.userSrvc.getUserById(
				JSON.parse(localStorage.getItem("user")!).id,
			)
			getUser.subscribe(
				async (data: any) => {
					this.store.dispatch(setUser.set(data))
					this.SocketSrvc.openSocket()
					const notifiys = await this.notifySrvc.getNorifications()
					notifiys.subscribe((data: any) => {
						data.forEach((element: any) => {
							this.store.dispatch(
								newNotification.set({
									data: element.data,
									title: element.title,
									message: element.message,
									time: element.time,
									id: element.id,
								}),
							)
						})
					})
					const matchesPending = await this.matchSrvc.readPendingMatch()
					matchesPending.subscribe((data: any) => {
						data.forEach((element: any) => {
							this.store.dispatch(newPendingMatch.set(element))
						})
					})
					const matchesRequest = await this.matchSrvc.readrequestMatches()
					matchesRequest.subscribe((data: any) => {
						data.forEach((element: any) => {
							this.store.dispatch(myRequestMatches.set(element))
						})
					})
					const matches = await this.matchSrvc.readMatch()
					matches.subscribe((data: any) => {
						data.forEach((element: any) => {
							this.store.dispatch(myMatches.set(element))
						})
					})
					const messages = await this.chatSrvc.readChats()
					messages.subscribe((data: any) => {
						console.log(data)
						data.forEach((element: any) => {
							this.store.dispatch(myMessages.set(element))
						})
					})
				},
				(err) => {
					console.log(err)
					if (err.status == 401) {
						Swal.fire(
							"Su sesión ha expirado",
							"Por favor vuelve a iniciar sesión",
							"error",
						)
						localStorage.removeItem("user")
						localStorage.removeItem("token")
						this.route.navigate(["/"])
					}
				},
			)
		}
	}
	ngAfterViewInit(): void {
		setTimeout(() => {
			$("#preloader").fadeOut("slow", function () {
				$(this).remove()
			})
		}, 2000)
	}

	isNavHome(): boolean {
		return ["","/login"].includes(this.location.path())
	}
}
