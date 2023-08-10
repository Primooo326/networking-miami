import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { UserService } from "src/app/services/user/user.service"
import { Usuario } from "src/app/tools/models"
import Swal from "sweetalert2"

@Component({
	selector: "app-user",
	templateUrl: "./user.component.html",
	styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit {
	currentUser: Usuario = JSON.parse(localStorage.getItem("user")!)
	isReady = false
	constructor(
		private userSrvc: UserService,
		private route: ActivatedRoute,
		private router: Router,
	) {}
	async ngOnInit() {
		this.route.paramMap.subscribe(async (data: any) => {
			await this.getUser(data.params.id)
		})
		$("#preloader").fadeOut("slow", function () {
			$(this).remove()
		})
	}
	async getUser(id) {
		const getUser = await this.userSrvc.getUserById(id)

		getUser.subscribe(
			(data: any) => {
				this.currentUser = data
				setTimeout(() => {
					this.isReady = true
				}, 1000)
			},
			(err) => {
				if (err.status == 404) {
					Swal.fire("Error", err.error, "error")
					this.router.navigate(["/home"])
				}
			},
		)
	}
}
