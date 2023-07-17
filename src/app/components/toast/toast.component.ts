import { Component, Input, OnInit } from "@angular/core"
import * as bootstrap from "bootstrap"
import { INotificacion } from "src/app/tools/models"

@Component({
	selector: "app-toast",
	templateUrl: "./toast.component.html",
	styleUrls: ["./toast.component.scss"],
})
export class ToastComponent implements OnInit {
	@Input() data!: INotificacion
	time = "hace 5 minutos"
	constructor() {}
	ngOnInit(): void {
		console.log(this.data)
		this.time = this.calcularTiempoTranscurrido(this.data.time)
		const toast = document.getElementById("liveToast") as HTMLElement
		new bootstrap.Toast(toast).show()
		$("livetoast")
	}

	cerrarToast() {
		const toast = document.getElementById("liveToast") as HTMLElement
		new bootstrap.Toast(toast).hide()
	}

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
}
