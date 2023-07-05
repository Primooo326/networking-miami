import { createReducer, on } from "@ngrx/store";
import { INotificacion, Usuario } from "src/app/tools/models";
import { setUser, newNotification, newMatchRequest } from "./actions";



const user:Usuario = JSON.parse(localStorage.getItem('user')!) != null ? JSON.parse(localStorage.getItem('user')!) as Usuario : {
  id: 101,
  nombre: "Juan Morales Lizarazo",
  email: "juan.dev.326@gmail.com",
  fechaNacimiento: "2020-02-26T00:00:00.000Z",
  verificado: 0,
  condado: "Duval",
  ciudad: "Neptune Beach",
  genero: "Masculino",
  telefono: "3196458411",
  biografia: "nota biografica",
  avatar: "http://localhost:4000/api/file/profile-1687554298793.png",
  fotoPortada: "https://img.freepik.com/free-photo/glitch-effect-black-background_53876-129025.jpg?w=740&t=st=1686934648~exp=1686935248~hmac=1ce13f8749d5e2fddc16cfa874fa7ac7b6ac58c88576f7e70527eb6bf08249c3",
  objetivo: "objetivo en networking miami",
  fechaIngreso: "2023-06-21T13:38:58.639Z",
  lenguajes: [
    "Chino (mandarín)",
    "Japonés",
    "Inglés",
    "Malayo",
    "Árabe"
  ],
  areaExperiencia: [
    "Análisis de datos",
    "Arquitectura de interiores"
  ],
  temasInteres: [
    "Emprendimiento",
    "Marketing",
    "Desarrollo personal",
    "Innovación",
    "Finanzas",
    "Salud y bienestar",
    "Big data"
  ],
  tipoConexion: [
    "Quiero compartir mi conocimiento.",
    "Estoy buscando una comunidad de la que formar parte."
  ],
}

export const initialState:Usuario = user

export const userReducer = createReducer(
  initialState,
  on(setUser.set, (state, {user}) => { console.log(user); localStorage.setItem("user",JSON.stringify(user)); return user})
)

const notification:INotificacion[] = []

export const initialNotification:INotificacion[] = notification

export const notificationReducer = createReducer(
  initialNotification,
  on( newNotification.set, (state, {notification}) => { console.log([...state, notification]); return [...state, notification]})
)

const matchRequest:any[] = []

export const initialMatchRequest = matchRequest

export const matchRequestReducer = createReducer(
  initialMatchRequest,
  on( newMatchRequest.set, (state, {matchRequest}) => { console.log([...state, matchRequest]); return [...state, matchRequest]})
)
