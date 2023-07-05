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
export interface INotificacion {
    title: string,
    message: string,
    time:string,
    data:any
}
export type ENotifyStatus = "leido" | "no leido" | "eliminado";
