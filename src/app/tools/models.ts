export enum EPages {
  login = 'login',
  home = 'home',
  landing = 'landing',
}

export type ENotifyTypes = 'match' | 'chat'

export interface Usuario {
  id: number | string;
  nombre: string;
  email: string;
  fechaNacimiento: string;
  verificado: number;
  condado: string;
  ciudad: string;
  genero: string;
  telefono: string;
  biografia: string;
  avatar: string;
  fotoPortada: string;
  objetivo: string;
  fechaIngreso: string;
  temasInteres: string[];
  areaExperiencia: string[];
  tipoConexion: string[];
  lenguajes: string[];
}

export interface Chat {
  sala: string;
  contacto: Contacto;
  mensajes: Mensajes[];
}
export interface Mensajes {
  fecha: string;
  mensaje: String;
}
export interface UsuarioPublicaciones {
  urlFotos: string[];
  tipo: string;
  descripcion: string;
  comentarios: PublicacionComentarios[];
  reacciones: PublicacionReacciones[];
  compartidos: PublicacionCompartidos[];
  precio: number | null;
}
export interface PublicacionCompartidos {
  usuario: Contacto;
}
export interface PublicacionReacciones {
  usuario: Contacto;
  reaccion: string;
}
export interface PublicacionComentarios {
  usuario: Contacto;
  comentario: string;
  fecha: string;
}
export interface Contacto {
  id: string;
  nombre: string;
  email: string;
  avatar: string;
  fotoPortada: string;
}
export interface UsuarioRedesSociales {
  red: string;
  link: string;
}
