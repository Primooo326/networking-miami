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
import { messagesSelect } from "src/redux/selectors"
import { myMessages } from "src/redux/actions"
import { SocketService } from "src/app/services/socket/socket.service"
import { Subscriber, Subscription } from "rxjs"

@Component({
	selector: "app-chat-modal",
	templateUrl: "./chat-modal.component.html",
	styleUrls: ["./chat-modal.component.scss"],
})
export class ChatModalComponent implements OnInit, AfterViewInit, OnDestroy {
	isShrink = true
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

	@Input() user: any

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
	@Output() valorChange = new EventEmitter<boolean>()
	currentUser = localStorage.getItem("user")
		? JSON.parse(localStorage.getItem("user")!)
		: null
	constructor(
		private chatSrvc: ChatService,
		private store: Store<any>,
		private socketSrvc: SocketService,
	) {}

	async ngOnInit() {
		const res = await this.chatSrvc.readMessages({
			idUser: this.user.id,
			idUser2: this.currentUser.id,
			batchsize: 50,
			currentbatch: 0,
		})

		console.log("onInit")

		res.subscribe(async (data: any) => {
			this.conversacion_id = data.conversacion_id
			this.mensajes = data.results.sort((a: any, b: any) => {
				return (
					new Date(a.fecha_envio).getTime() - new Date(b.fecha_envio).getTime()
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
		})

		this.newMessageHandler = (data: any) => {
			this.handleNewMessage(data)
		}
		this.socketSrvc.socket.on("newMessage", this.newMessageHandler)
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
		this.valorChange.emit(this.isHidden)
		if (this.isHidden) {
			this.ngOnDestroy()
		}
	}

	async sendMessage() {
		if (this.inputText.valid) {
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
			})
		}
	}
	onKeydown(event: any) {
		if (event.key === "Enter") {
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
}
