import { createReducer, on } from "@ngrx/store"
import { INotificacion, Usuario } from "src/app/tools/models"
import {
	setUser,
	newNotification,
	newPendingMatch,
	myRequestMatches,
	myMatches,
	myMessages,
	userChat,
} from "./actions"

const user: Usuario =
	JSON.parse(localStorage.getItem("user")!) != null
		? (JSON.parse(localStorage.getItem("user")!) as Usuario)
		: {
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
				fotoPortada:
					"https://img.freepik.com/free-photo/glitch-effect-black-background_53876-129025.jpg?w=740&t=st=1686934648~exp=1686935248~hmac=1ce13f8749d5e2fddc16cfa874fa7ac7b6ac58c88576f7e70527eb6bf08249c3",
				objetivo: "objetivo en networking miami",
				fechaIngreso: "2023-06-21T13:38:58.639Z",
				lenguajes: ["Chino (mandarín)", "Japonés", "Inglés", "Malayo", "Árabe"],
				areaExperiencia: ["Análisis de datos", "Arquitectura de interiores"],
				temasInteres: [
					"Emprendimiento",
					"Marketing",
					"Desarrollo personal",
					"Innovación",
					"Finanzas",
					"Salud y bienestar",
					"Big data",
				],
				tipoConexion: [
					"Quiero compartir mi conocimiento.",
					"Estoy buscando una comunidad de la que formar parte.",
				],
		  }

export const initialState: Usuario = user

export const userReducer = createReducer(
	initialState,
	on(setUser.set, (state, { user }) => {
		localStorage.setItem("user", JSON.stringify(user))
		return user
	}),
	on(setUser.verifyEmail, (state, { user }) => ({ ...state, verificado: 1 })),
)

const notification: INotificacion[] = []

export const initialNotification: INotificacion[] = notification

export const notificationReducer = createReducer(
	initialNotification,
	on(newNotification.set, (state, { notification }) => {
		return [...state, notification]
	}),
	on(newNotification.delete, (state, { notification }) => {
		return state.filter((item: any) => item.id !== notification.id)
	}),
)

const pendingMatches: any[] = []

export const initialpendingMatches = pendingMatches

export const pendingMatchesReducer = createReducer(
	initialpendingMatches,
	on(newPendingMatch.set, (state, { matchRequest }) => {
		return [...state, matchRequest]
	}),
	on(newPendingMatch.delete, (state, { cancelMatch }) => {
		return state.filter((item: any) => item.id !== cancelMatch.id)
	}),
)

const matchRequest: any[] = []

export const initialMatchRequest = matchRequest

export const requestMatchesReducer = createReducer(
	initialMatchRequest,
	on(myRequestMatches.set, (state, { requestMatches }) => {
		return [...state, requestMatches]
	}),
	on(myRequestMatches.delete, (state, { cancelRequestMatch }) => {
		return state.filter((item: any) => item.id !== cancelRequestMatch.id)
	}),
)

const matches: any[] = []
export const initialMatches = matches

export const matchesReducer = createReducer(
	initialMatches,
	on(myMatches.set, (state, { matches }) => {
		return [...state, matches]
	}),
	on(myMatches.delete, (state, { cancelMatch }) => {
		return state.filter((item: any) => item.id !== Number(cancelMatch.id))
  }),
  on(myMatches.update, (state, { match }) => {
    return state.map((item: any) => {
      if (item.id === match.id) {
        return match
      }
      return item
    })
  }),
)
const messages: any[] = []
export const initialMessages = messages

export const messagesReducer = createReducer(
	initialMessages,
	on(myMessages.set, (state, { messages }) => {
		return [...state, messages]
	}),
	on(myMessages.update, (state, { message }) => {
		return state.map((item: any) => {
			if (item.id === message.id) {
				return message
			}
			return item
		})
  }),
  on(myMessages.reload, (state) => {
    return state.slice()
  }),
)
export const initialUserChat = null

export const userChatReducer = createReducer(
	initialUserChat,
	on(userChat.set, (state, { user }) => {
		return user
	}),
	on(userChat.delete, (state) => {
		return null
	}),
)
