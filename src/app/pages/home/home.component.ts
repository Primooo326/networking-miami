import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MailService } from 'src/app/services/mail/mail.service';
import { UserService } from 'src/app/services/user/user.service';
import {  Usuario } from 'src/app/tools/models';
import Swal from 'sweetalert2';
import * as Masonry  from "masonry-layout"


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

	idiomas = JSON.parse(localStorage.getItem("lenguajes")!)
	experiencia = JSON.parse(localStorage.getItem("experiencia")!)
	intereses = JSON.parse(localStorage.getItem("interes")!)
	condados = JSON.parse(localStorage.getItem("condados")!)
	condadoSelected: { nombre: string; ciudades: string[] }
	ciudades: string[] = []
  verificado = false;
  onVerifyEmail = false;
	currentPageNewMatches = 1
	showUsersNewMatches: any[] = []
	users: Usuario[] = []
	orderBy = "Todos los miembros"
	pages: number[] = []

	isOnAdvancedFilters = false

	filterInput = new FormControl("", Validators.required)


  currentUser = JSON.parse(localStorage.getItem('user')!);
  constructor(private userSrvc: UserService, private mailSrvc: MailService) {

    this.ciudades = this.condados[0].ciudades
		this.condadoSelected = this.condados[0]
  }
  async ngOnInit() {
    this.currentUser.verificado == 0 ? (this.verificado = false) : (this.verificado = true);

		await this.userSrvc.readUsers().then((obs) =>
			obs.subscribe((data:any) => {
				this.users = data
        console.log(this.users[0]);
				this.users.length / 4

				while (this.pages.length < this.users.length / 4) {
					this.pages.push(this.pages.length)
				}
				this.changePageNewMatches(0)
			}),
		)
  }
  async verifyEmail() {
    this.onVerifyEmail = true;
    const res = await this.mailSrvc.verifyEmail({
      email: this.currentUser.email,
    });
    res.subscribe(
      (data) => {
        console.log(data);
        this.onVerifyEmail = false;
      },
      (err) => {
        Swal.fire('error', err.error, 'error');
        this.onVerifyEmail = false;
      }
    );}
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
					const idx = this.condados.findIndex((c:any) => c.nombre === condado)
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
    this.initMasonry()
	}
  async applyFilter() {
		const filter = this.filterInput.value

    const res = await this.userSrvc.searchUsers(50,0,filter!)

    res.subscribe((data:any)=>{
      this.users = data
      // this.users.length / 4

      // while (this.pages.length < this.users.length / 4) {
      //   this.pages.push(this.pages.length)
      // }
      console.log(data);
      this.changePageNewMatches(0)
    },(err)=>{
      console.log(err);
    })

		// this.showUsersNewMatches = this.users.filter(
		// 	(user) =>
		// 		user.nombre.toLowerCase().includes(filter!.toLowerCase()) ||
		// 		user.email.toLowerCase().includes(filter!.toLowerCase()),
		// )
	}

  changePageNewMatches(page: number) {
		this.currentPageNewMatches = page
		this.showUsersNewMatches = this.users.filter(() => true)
		this.showUsersNewMatches = this.showUsersNewMatches.splice(page * 4, 20)
		console.log(this.users.length)
    this.initMasonry()
	}
  initMasonry(){
    setTimeout(()=>{

      var grid = document.querySelector('.rowmsry');
      new Masonry( grid!, {
        itemSelector: '.colmsry',
        gutter: 0,
        resize: true,
        initLayout: true,
        transitionDuration: '0.2s',
        stagger: 0,
        percentPosition: true,
        horizontalOrder: true,
        originLeft: true,
        originTop: true,


      });
    },10)
  }
  changeOrder(order: string) {
		this.orderBy = order
	}
  onChangeEvent(e: any) {
		console.log(e)
		this.ngOnInit()
	}
  canNextPageNewMatches(): Boolean {
		const items = this.users.filter(() => true)

		const page = this.currentPageNewMatches + 1
		return items.splice(page * 4, 20).length == 0
	}
  onCondadoChange() {
		this.ciudades = this.ciudades.filter((c) => true)
	}
}
