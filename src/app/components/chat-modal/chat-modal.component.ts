import {
	AfterViewInit,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
} from "@angular/core"
import { FormControl, Validators } from "@angular/forms"
import { Store } from "@ngrx/store"
import { ChatService } from "src/app/services/chat/chat.service"
import { messagesSelect } from "src/redux/selectors"
import { myMessages } from "src/redux/actions"

@Component({
	selector: "app-chat-modal",
	templateUrl: "./chat-modal.component.html",
	styleUrls: ["./chat-modal.component.scss"],
})
export class ChatModalComponent implements OnInit, AfterViewInit {
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

	@Output() valorChange = new EventEmitter<boolean>()
	currentUser = localStorage.getItem("user")
		? JSON.parse(localStorage.getItem("user")!)
		: null
	constructor(private chatSrvc: ChatService, private store: Store<any>) {}

	async ngOnInit() {
		const res = await this.chatSrvc.readMessages({
			idUser: this.user.id,
			idUser2: this.currentUser.id,
			batchsize: 50,
			currentbatch: 0,
		})

		res.subscribe((data: any) => {
			console.log(data)
			this.conversacion_id = data.conversacion_id
			this.mensajes = data.results.map((item: any) => {
				return {
					contenido: item.contenido,
					fecha_envio: item.fecha_envio,
					remitente_id: item.remitente_id,
					destinatario_id: item.destinatario_id,
					conversacion_id: item.conversacion_id,
					estado: item.estado,
					id: item.id,
				}
			})
			data.results.forEach(async (element: any) => {
				console.log(element.id)
				await this.chatSrvc.updateMessage({ id: element.id })
				this.store.dispatch(myMessages.update(data))
			})
		})
		this.mensajes$.subscribe((data: any) => {
			if (data.conversacion_id == this.conversacion_id) {
				console.log("new mensaje!!!", data)
				if (data.estado != "visto") {
					data.estado = "visto"
					this.chatSrvc.updateMessage({ id: data.id })
					this.store.dispatch(myMessages.update(data))
				}
				this.mensajes.push(data)
				setTimeout(() => {
					$("#modal-body").scrollTop($("#modal-body").prop("scrollHeight"))
				}, 100)
			}
		})
	}
	ngAfterViewInit() {
		setTimeout(() => {
			$("#modal-body").scrollTop($("#modal-body").prop("scrollHeight"))
		}, 100)
	}

	shrinkChat() {
		this.isShrink = !this.isShrink
		console.log("isShrink")

		if (!this.isShrink) {
			setTimeout(() => {
				$("#modal-body").scrollTop($("#modal-body").prop("scrollHeight"))
			}, 1000)
		}
	}

	hideChat() {
		this.isHidden = !this.isHidden
		this.valorChange.emit(this.isHidden)
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
				console.log(data)
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
}
