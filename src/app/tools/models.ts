export enum EPages {
	login = "login",
	home = "home",
	landing = "landing",
}

export type ENotifyTypes = "match" | "chat"

export interface Usuario {
	id?: number
	nombre: string
	email: string
	fechaNacimiento: string
	verificado: number
	condado: string
	ciudad: string
	genero: string
	telefono: string
	biografia: string
	avatar: string
	fotoPortada: string
	objetivo: string
	fechaIngreso: string
	temasInteres: string[]
	areaExperiencia: string[]
	tipoConexion: string[]
	lenguajes: string[]
}
export interface INotificacion {
	title: string
	message: string
	time: string
	data: any
	id: number
}
export type ETypePerfil =
	| "contacto"
	| "solicitud"
	| "solicitante"
	| "desconocido"
export type ENotifyStatus = "leido" | "no leido" | "eliminado"

export interface Chat{
  id: number;
    conversacion_id:number;
  remitente_id: number;
  destinatario_id: number;
  contenido: string;
  estado: ENotifyStatus;
  fecha_envio: string;
}
export interface UsuarioWithLastChat extends Usuario {
  lastMessage: Chat;
}
export interface UsuarioMatch extends Usuario {
  fijado: 1 | 0;
  contactoDb_id: number;
}
