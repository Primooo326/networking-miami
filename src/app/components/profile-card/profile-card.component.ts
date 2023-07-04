import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"
import { MatchService } from "src/app/services/match/match.service"
import { UserService } from "src/app/services/user/user.service"
import { UserData, Usuario } from "src/app/tools/models"
import Swal from "sweetalert2"

@Component({
	selector: "app-profile-card",
	templateUrl: "./profile-card.component.html",
	styleUrls: ["./profile-card.component.scss"],
})
export class ProfileCardComponent implements OnInit {
	@Input() user!: Usuario
	@Input() isMatch: boolean = false
	@Output() isDeleted = new EventEmitter()
	@Output() isMatched = new EventEmitter()
	constructor(private userSrvc: UserService, private matchSrvc: MatchService) {}

	ngOnInit(): void {}

	async conectar() {

    Swal.fire({
      title: '¿Seguro quieres conectar con este usuario?',
      showCancelButton: true,
      confirmButtonText: 'Conectar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire('Solicitud enviada!', '', 'success')
        const  user  = JSON.parse(localStorage.getItem("user")!)
        const body = {
          idToMatch: this.user.id,
          idUser: user.id,
        }
        const res = await this.matchSrvc.createMatch(body)
        res.subscribe(
          (data) => {
            console.log(data)
            this.isMatched.emit("match")
          },
          (err) => {
            console.log("error::", err)
          },
        )
      }
    })

	}
	async eliminar() {
		const res = await this.matchSrvc.deleteMatch(this.user.id.toString())
		res.subscribe(
			(data) => {
				console.log(data)
				this.isDeleted.emit("delete")
			},
			(err) => {
				console.log("error::", err)
			},
		)
	}
}
