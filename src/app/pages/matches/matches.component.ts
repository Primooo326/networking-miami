import { Component, OnInit } from "@angular/core"
import { Usuario } from "src/app/tools/models"
import { UserService } from "../../services/user/user.service"
import { MatchService } from "../../services/match/match.service"
import { FormControl, Validators } from "@angular/forms"
import * as Masonry from "masonry-layout"

@Component({
	selector: "app-matches",
	templateUrl: "./matches.component.html",
	styleUrls: ["./matches.component.scss"],
})
export class MatchesComponent implements OnInit {
	idiomas = JSON.parse(localStorage.getItem("lenguajes")!)
	experiencia = JSON.parse(localStorage.getItem("experiencia")!)
	intereses = JSON.parse(localStorage.getItem("interes")!)
	condados = JSON.parse(localStorage.getItem("condados")!)
	currentUser = JSON.parse(localStorage.getItem("user")!)

	condadoSelected: { nombre: string; ciudades: string[] }
	ciudades: string[] = []
	TipoConexion: string[] = []
	orderBy = "Todos los miembros"
	currentPage = 1
	users: any[] = []
	usersMatches: any[] = []
	pages: number[] = []
	showUsers: any[] = []
	currentPageNewMatches = 1
	showUsersNewMatches: Usuario[] = []
	filterInput = new FormControl("", Validators.required)
	isOnAdvancedFilters = false
	constructor(private userSrvc: UserService, private matchSrvc: MatchService) {
		this.ciudades = this.condados[0].ciudades
		this.condadoSelected = this.condados[0]
	}
	async ngOnInit() {
		await this.matchSrvc.readMatch().then(
			(obs) =>
				obs.subscribe((data: any) => {
					this.usersMatches = data.result
					this.changePageMisMatches(0)
					console.log(data)
				}),
			(err) => {
				console.log("err:", err)
			},
		)

		await this.userSrvc.readUsers().then((obs) =>
			obs.subscribe((data: any) => {
				this.users = data
				console.log(this.users[0])
				this.users.length / 4

				while (this.pages.length < this.users.length / 4) {
					this.pages.push(this.pages.length)
				}
				this.changePageNewMatches(0)
			}),
		)
	}
	changeOrder(order: string) {
		this.orderBy = order
	}
	changePageMisMatches(page: number) {
		this.currentPage = page
		this.showUsers = this.usersMatches.filter(() => true)
		this.showUsers = this.showUsers.splice(page * 4, 12)
		console.log(this.usersMatches.length)
	}
	changePageNewMatches(page: number) {
		this.currentPageNewMatches = page
		this.showUsersNewMatches = this.users.filter(() => true)
		this.showUsersNewMatches = this.showUsersNewMatches.splice(page * 4, 12)
		console.log(this.users.length)
		this.initMasonry()
	}
	canNextPageMisMatches(): Boolean {
		const items = this.usersMatches.filter(() => true)
		const page = this.currentPage + 1
		return items.splice(page * 4, 4).length == 0
	}
	canNextPageNewMatches(): Boolean {
		const items = this.users.filter(() => true)

		const page = this.currentPageNewMatches + 1
		return items.splice(page * 4, 4).length == 0
	}
	async applyFilter() {
		const filter = this.filterInput.value

		const res = await this.userSrvc.searchUsers(50, 0, filter!)

		res.subscribe(
			(data: any) => {
				this.users = data
				// this.users.length / 4

				// while (this.pages.length < this.users.length / 4) {
				//   this.pages.push(this.pages.length)
				// }
				console.log(data)
				this.changePageNewMatches(0)
			},
			(err) => {
				console.log(err)
			},
		)

		// this.showUsersNewMatches = this.users.filter(
		// 	(user) =>
		// 		user.nombre.toLowerCase().includes(filter!.toLowerCase()) ||
		// 		user.email.toLowerCase().includes(filter!.toLowerCase()),
		// )
	}
	onChangeEvent(e: any) {
		console.log(e)
		this.ngOnInit()
	}
	onCondadoChange() {
		this.ciudades = this.ciudades.filter((c) => true)
	}
	onAdvanceFilters() {
		this.isOnAdvancedFilters = !this.isOnAdvancedFilters
		if (this.isOnAdvancedFilters) {
			setTimeout(() => {
				$("select.select2").select2({
					theme: "classic",
					dropdownAutoWidth: true,
					width: "100%",
					minimumResultsForSearch: Infinity,
				})

				// $("select#condado").val(this.infoBasicaForm.get("condado")?.value)

				$("select#condado").on("change", (e: any) => {
					const condado: any = $(e.target).val()
					// this.infoBasicaForm.get("condado")?.setValue(condado)
					const idx = this.condados.findIndex((c: any) => c.nombre === condado)
					this.ciudades = this.condados[idx].ciudades
					this.condadoSelected = this.condados[idx]
					document.getElementById("boton")?.click()
				})

				// $("select#ciudad").val(this.infoBasicaForm.get("ciudad")?.value)

				$("select#ciudad").on("change", (e: any) => {
					const ciudad: any = $(e.target).val()

					// this.infoBasicaForm.get("ciudad")?.setValue(ciudad)
				})

				$("select#gender").on("change", (e: any) => {
					const genero: any = $(e.target).val()
					// this.infoBasicaForm.get("genero")?.setValue(genero)
				})
			}, 100)
		}
	}
	initMasonry() {
		setTimeout(() => {
			var grid = document.querySelector(".rowmsry")
			new Masonry(grid!, {
				itemSelector: ".colmsry",
				gutter: 0,
				resize: true,
				initLayout: true,
				transitionDuration: "0.2s",
				stagger: 0,
				percentPosition: true,
				horizontalOrder: true,
				originLeft: true,
				originTop: true,
			})
		}, 100)
	}
}
