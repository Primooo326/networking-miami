import {
	AfterViewInit,
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
} from "@angular/core"
import { FormControl, Validators } from "@angular/forms"
import { Store } from "@ngrx/store"
import { ChatService } from "src/app/services/chat/chat.service"
import { messagesSelect, userChatSelect } from "src/redux/selectors"
import { myMatches, myMessages, userChat } from "src/redux/actions"
import { SocketService } from "src/app/services/socket/socket.service"
import { Subscriber, Subscription } from "rxjs"
import { MatchService } from "src/app/services/match/match.service"

@Component({
	selector: "app-chat-modal",
	templateUrl: "./chat-modal.component.html",
	styleUrls: ["./chat-modal.component.scss"],
})
export class ChatModalComponent implements OnInit, AfterViewInit, OnDestroy {
	isShrink = false
	isHidden = true
	mensajes$ = this.store.select(messagesSelect)
	mensajes: {
		contenido: string
		fecha_envio: string
		remitente_id: number
		destinatario_id: number
		conversacion_id: number
	}[] = []
	conversacion_id: number = 0

	inputText: FormControl = new FormControl("", Validators.required)

	// @Input() user: any
	user: any
	@Input()
	set valor(value: boolean) {
		this.isShrink = false
		this.isHidden = value
	}

	get valor() {
		return this.isHidden
	}

	private subscription!: Subscription
	private socketSubscription!: Subscription
	private newMessageHandler: any
	userChat$ = this.store.select(userChatSelect)
	currentUser = localStorage.getItem("user")
		? JSON.parse(localStorage.getItem("user")!)
		: null
	isOnSend = false
	constructor(
		private chatSrvc: ChatService,
		private store: Store<any>,
    private socketSrvc: SocketService,
    private matchSrvc:MatchService
	) {
		this.userChat$.subscribe((data) => {
			this.ngOnDestroy()
			this.user = data
			console.log(data)
			this.ngOnInit()
		})
	}

	async ngOnInit() {
		if (this.user) {
			const res = await this.chatSrvc.readMessages({
				idUser: this.user.id,
				idUser2: this.currentUser.id,
				batchsize: 50,
				currentbatch: 0,
			})

			this.isShrink = false
			this.isHidden = true

			res.subscribe(async (data: any) => {
				this.conversacion_id = data.conversacion_id
				this.mensajes = data.results.sort((a: any, b: any) => {
					return (
						new Date(a.fecha_envio).getTime() -
						new Date(b.fecha_envio).getTime()
					)
				})

				for (const element of data.results) {
					if (element.estado != "visto") {
						element.estado = "visto"
						const res2 = await this.chatSrvc.updateMessage({ id: element.id })
						res2.subscribe(
							(data) => {
								console.log(data)
							},
							(err) => {
								console.log(err)
							},
						)
						this.store.dispatch(myMessages.update(element))
					}
				}
				setTimeout(() => {
					$("#modal-body").scrollTop($("#modal-body").prop("scrollHeight"))
				}, 100)
			})

			this.newMessageHandler = (data: any) => {
				this.handleNewMessage(data)
			}
			this.socketSrvc.socket.on("newMessage", this.newMessageHandler)
		} else {
			this.ngOnDestroy()
		}
	}
	ngAfterViewInit() {
		setTimeout(() => {
			$("#modal-body").scrollTop($("#modal-body").prop("scrollHeight"))
		}, 500)
	}

	shrinkChat() {
		this.isShrink = !this.isShrink

		if (!this.isShrink) {
			setTimeout(() => {
				$("#modal-body").scrollTop($("#modal-body").prop("scrollHeight"))
			}, 1000)
		}
	}

	hideChat() {
		this.isHidden = !this.isHidden
		this.store.dispatch(userChat.delete())
		this.ngOnDestroy()
	}

	async sendMessage() {
		if (this.inputText.valid) {
			this.isOnSend = true
			const res = await this.chatSrvc.sendMessage({
				contenido: this.inputText.value,
				destinatario_id: this.user.id,
				conversacion_id: this.conversacion_id,
				remitente_id: this.currentUser.id,
			})
			res.subscribe((data: any) => {
        this.mensajes.push(data)

				this.inputText.reset()
				setTimeout(() => {
          $("#modal-body").scrollTop($("#modal-body").prop("scrollHeight"))
				}, 100)
        this.store.dispatch(myMessages.set(data))
				this.isOnSend = false
			})
		}
	}
	onKeydown(event: any) {
		if (event.key === "Enter" && !this.isOnSend) {
			this.sendMessage()
		}
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe()
		}

		if (this.socketSubscription) {
			this.socketSubscription.unsubscribe()
		}
		if (this.newMessageHandler) {
			this.socketSrvc.socket.off("newMessage", this.newMessageHandler)
		}
	}
	async handleNewMessage(data: any) {
		if (data.conversacion_id === this.conversacion_id) {
			if (data.estado != "visto") {
				const res = await this.chatSrvc.updateMessage({ id: data.id })
				res.subscribe(
					(data) => {
						console.log(data)
					},
					(err) => {
						console.log(err)
					},
				)

				this.store.dispatch(myMessages.update({ ...data, estado: "visto" }))
			}
			this.mensajes.push(data)
			setTimeout(() => {
				$("#modal-body").scrollTop($("#modal-body").prop("scrollHeight"))
			}, 100)
		}
  }
  async toggleFijado() {
    const fijado = this.user.fijado === 0 ? 1 : 0
    await this.matchSrvc.updateMatch(this.user.contactoDb_id, fijado).then((data: any) => {
      console.log(data);
      this.user.fijado = fijado
      this.store.dispatch(myMatches.update(this.user))
    }).catch((err: any) => {
      console.log(err);
    })
  }
}
