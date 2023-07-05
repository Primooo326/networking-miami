import { Component, Input, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { INotificacion } from 'src/app/tools/models';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {


  @Input() data!: INotificacion
  // time = this.data.time == undefined?  "" : "this.data.time" + "ago"
  time = "hace 5 minutos"

//   {
//     "data": {
//         "id": 303,
//         "nombre": "Juan Morales",
//         "email": "juan.dev.326@gmail.com",
//         "password": "$2a$11$yPYWdrwPxa1Re/78EllMMOIOaZWuDUzcK2xkMsHO99dV7g6Z2ioha",
//         "fechaNacimiento": "2002-03-26T00:00:00.000Z",
//         "verificado": 0,
//         "condado": "Alachua",
//         "ciudad": "High Springs",
//         "genero": "Masculino",
//         "telefono": "3121584984",
//         "biografia": "asdyqhuvgsxo8aughsd\n",
//         "avatar": "https://robohash.org/nequearchitectopariatur.png?size=50x50&set=set1",
//         "fotoPortada": "https://img.freepik.com/free-photo/glitch-effect-black-background_53876-129025.jpg?w=740&t=st=1686934648~exp=1686935248~hmac=1ce13f8749d5e2fddc16cfa874fa7ac7b6ac58c88576f7e70527eb6bf08249c3",
//         "objetivo": "asdasd",
//         "fechaIngreso": "2023-06-26T22:01:18.027Z",
//         "lenguajes": [
//             "Español",
//             "Hindi"
//         ],
//         "areaExperiencia": [
//             "Desarrolladores de software"
//         ],
//         "temasInteres": [
//             "Tecnología"
//         ],
//         "tipoConexion": [
//             "Estoy buscando trabajo.",
//             "Quiero compartir mi conocimiento."
//         ]
//     },
//     "title": "¡Nueva solicitud!",
//     "message": "Juan Morales te ha enviado una solicitud.",
//     "time": "2023-07-05T16:24:45.993Z"
// }

  constructor() {

  }
  ngOnInit(): void {
    console.log(this.data);
    this.time = this.calcularTiempoTranscurrido(this.data.time)
    const toast = document.getElementById('liveToast') as HTMLElement
    new bootstrap.Toast(toast).show()
  }

  calcularTiempoTranscurrido(desde: string): string {
    const fechaActual = new Date();
    const fechaPasada = new Date(desde);
    const diferenciaMilisegundos = fechaActual.getTime() - fechaPasada.getTime();

    // Cálculo de las diferentes unidades de tiempo
    const segundos = Math.floor(diferenciaMilisegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) {
      return `Hace ${dias} día(s)`;
    } else if (horas > 0) {
      return `Hace ${horas} hora(s)`;
    } else if (minutos > 0) {
      return `Hace ${minutos} minuto(s)`;
    } else {
      return `Hace unos segundos`;
    }
  }
}
