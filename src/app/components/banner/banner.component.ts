import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"
import { Usuario } from "src/app/tools/models"

@Component({
	selector: "app-banner",
	templateUrl: "./banner.component.html",
	styleUrls: ["./banner.component.scss"],
})
export class BannerComponent implements OnInit {
	@Input() user!: Usuario
  @Input() canEdit: boolean = false

	@Output() isOnEdit = new EventEmitter<boolean>()

	onEdit() {
		this.isOnEdit.emit(true)
	}
  ngOnInit(): void {
    console.log(this.user);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
}
