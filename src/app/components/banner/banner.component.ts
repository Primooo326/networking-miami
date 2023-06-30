import { Component, EventEmitter, Input, Output } from "@angular/core"
import { Usuario } from "src/app/tools/models"

@Component({
	selector: "app-banner",
	templateUrl: "./banner.component.html",
	styleUrls: ["./banner.component.scss"],
})
export class BannerComponent {
	@Input() user!: Usuario

	@Output() isOnEdit = new EventEmitter<boolean>()

	get isCurrentUser(): boolean {
		const localUser = JSON.parse(localStorage.getItem("user") || "{}")
		return localUser.id === this.user.id
	}
	onEdit() {
		this.isOnEdit.emit(true)
	}
}
