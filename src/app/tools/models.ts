export enum EPages {
	login = "login",
	home = "home",
	landing = "landing",
}
export interface UserData {
  id: number;
  email: string;
  name: string;
  birthdate: string;
  phone: string;
  gender: string;
  city: string;
  biography: string;
  objetivo: string;
  avatar: string;
  isMailVerified: number;
}

