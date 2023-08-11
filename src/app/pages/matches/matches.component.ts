import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core"
import { MatchService } from "../../services/match/match.service"
import { FormControl, Validators } from "@angular/forms"
import { Store } from "@ngrx/store"
import { matchSelect, userSelect } from "src/redux/selectors"
import Swal from "sweetalert2"
import { MailService } from "src/app/services/mail/mail.service"
import Masonry from "masonry-layout"
import { Subscription } from "rxjs"

@Component({
	selector: "app-matches",
	templateUrl: "./matches.component.html",
	styleUrls: ["./matches.component.scss"],
})
export class MatchesComponent implements OnInit, OnDestroy, AfterViewInit {
	currentUser: any // Type should be replaced with the actual User type if available.
	onVerifyEmail = false
	currentPage = 1
	usersMatches: any[] = []
	pages: number[] = []
	showUsers: any[] = []
	filterInput = new FormControl("", Validators.required)
	misMatches$ = this.store.select(matchSelect)
	verificado = false
	private misMatchesSubscription: Subscription | undefined
	private userSelectSubscription: Subscription | undefined

	constructor(
		private matchSrvc: MatchService,
		private store: Store<any>,
		private mailSrvc: MailService,
	) {}

	async ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem("user")!)
		this.misMatchesSubscription = this.misMatches$.subscribe((data: any) => {
			this.usersMatches = data
			this.changePageMisMatches(0)
		})

		// (await this.matchSrvc.readMatch()).subscribe(
		//   (data: any) => {
		//     this.usersMatches = data;
		//     this.changePageMisMatches(0);
		//   },
		//   (err) => {
		//     console.log(err);
		//   }
		// );

		this.userSelectSubscription = this.store
			.select(userSelect)
			.subscribe((data) => {
				this.verificado = data.verificado === 1
			})
	}

	ngOnDestroy() {
		if (this.misMatchesSubscription) {
			this.misMatchesSubscription.unsubscribe()
		}
		if (this.userSelectSubscription) {
			this.userSelectSubscription.unsubscribe()
		}
	}

	ngAfterViewInit() {
		this.initMasonry()
		$("#preloader").fadeOut("slow", function () {
			$(this).remove()
		})
	}

	async verifyEmail() {
		this.onVerifyEmail = true
		try {
			await (
				await this.mailSrvc.verifyEmail({ email: this.currentUser.email })
			).toPromise()
			this.onVerifyEmail = false
			Swal.fire(
				"Correo reenviado",
				`Se ha reenviado un correo a ${this.currentUser.email}. Acéptalo y verifica tu cuenta`,
				"success",
			)
		} catch (err: any) {
			Swal.fire("error", err.error, "error")
			this.onVerifyEmail = false
		}
	}

	changePageMisMatches(page: number) {
		this.currentPage = page
		this.showUsers = this.usersMatches.slice(page * 20, (page + 1) * 20)
		this.initMasonry()
	}

	canNextPageMisMatches(): boolean {
		const items = this.usersMatches.filter(() => true)
		const page = this.currentPage + 1
		return items.slice(page * 20, (page + 1) * 20).length === 0
	}

	onChangeEvent(e: any) {
		console.log(e)
		this.ngOnInit()
	}

	initMasonry() {
		setTimeout(() => {
			const grid = document.querySelector(".rowmsry")
			if (grid) {
				new Masonry(grid, {
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
			}
		}, 100)
	}
}
