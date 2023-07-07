import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"
import { AppComponent } from "src/app/app.component"
import { MatchService } from "src/app/services/match/match.service"
import { SocketService } from "src/app/services/socket/socket.service"
import { UserService } from "src/app/services/user/user.service"
import { ETypePerfil, Usuario } from "src/app/tools/models"
import Swal from "sweetalert2"

@Component({
	selector: "app-profile-card",
	templateUrl: "./profile-card.component.html",
	styleUrls: ["./profile-card.component.scss"],
})
export class ProfileCardComponent implements OnInit {
	@Input() user!: Usuario
	@Input() typeProfile: ETypePerfil = "desconocido"
	@Output() event = new EventEmitter()
	constructor(private userSrvc: UserService, private matchSrvc: MatchService, private socketSrvc:SocketService, private appComponent:AppComponent) {}

	ngOnInit(): void {}

	async solicitar() {

    Swal.fire({
      title: '¿Seguro quieres conectar con este usuario?',
      showCancelButton: true,
      confirmButtonText: 'Conectar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const  user  = JSON.parse(localStorage.getItem("user")!)
        const body = {
          usuario_id: this.user.id,
          usuario_request: user,
        }
        // this.socketSrvc.notifyEmitter(body, 'match')

        Swal.fire('¡Solicitud enviada!', '', 'success')
        const res = await this.matchSrvc.requestMatch(body)
        res.subscribe(
          (data) => {
            console.log(data)
            this.event.emit({type:"matchRequest",user:this.user})
          },
          (err) => {
            Swal.fire('Error', err, 'error')
            console.log("error::", err)
          },
        )
      }
    })

	}
  async aceptar(){

    Swal.fire({
      title: '¿Seguro quieres aceptar la solicitud?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const  user  = JSON.parse(localStorage.getItem("user")!)
        const body = {
          idToMatch: this.user.id,
          idUser: user.id,
        }
        // this.socketSrvc.notifyEmitter(body, 'match')

        Swal.fire('¡Solicitud aceptada!', '', 'success')
        const res = await this.matchSrvc.createMatch(body)
        this.appComponent.ngOnInit()
        res.subscribe(
          (data) => {
            console.log(data)
            this.event.emit("match")
          },
          (err) => {
            Swal.fire('Error', err, 'error')
            console.log("error::", err)
          },
        )
      }
    })

  }
	async eliminarSolictud() {

    Swal.fire({
      title: '¿Seguro quieres cancelar la solicitud?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      'icon': 'warning'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await this.matchSrvc.deleteRequestMatch(this.user.id.toString())
        res.subscribe(
          (data) => {
            Swal.fire('¡Solicitud eliminada!', '', 'success')
            console.log(data)
            this.event.emit({type:"deleteRequest",user:this.user})
          },
          (err) => {
            console.log("error::", err)
          },
        )
      }
    })


	}
  async eliminarMatch() {
    Swal.fire({
      title: '¿Seguro quieres eliminar al contacto?'+ this.user.nombre,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      'icon': 'warning'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await this.matchSrvc.deleteMatch(this.user.id.toString())
        res.subscribe(
          (data) => {
            Swal.fire('¡Contacto eliminado!', '', 'success')
            console.log(data)
            this.appComponent.ngOnInit()
            this.event.emit({type:"deleteMatch",user:this.user})
          },
          (err) => {
            Swal.fire('¡Error!', err, 'error')
            console.log("error::", err)
          },
        )
      }
    })

  }
}
