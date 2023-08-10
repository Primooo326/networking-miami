import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "src/environments/environment"

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private backend = environment.backend + "api/"

	constructor(private http: HttpClient) {}

	private get getUser(): any {
		return JSON.parse(localStorage.getItem("user")!)
	}

	async login(body: any) {
		const url = this.backend + "auth/login"

		return this.http.post(url, body)
	}

	async register(body: any): Promise<any> {
		const url = this.backend + "auth/register"
		return this.http.post(url, body)
	}
	async changePassword(body: any): Promise<any> {
		const url = this.backend + "auth/changePasswod"
		return this.http.post(url, body)
	}

	async datas() {
		await this.http.get(`${this.backend}admin/interes`).subscribe((data) => {
			localStorage.setItem("interes", JSON.stringify(data))
		})
		await this.http.get(`${this.backend}admin/conexion`).subscribe((data) => {
			localStorage.setItem("conexion", JSON.stringify(data))
		})
		await this.http.get(`${this.backend}admin/condados`).subscribe((data) => {
			localStorage.setItem("condados", JSON.stringify(data))
		})
		await this.http.get(`${this.backend}admin/lenguaje`).subscribe((data) => {
			localStorage.setItem("lenguajes", JSON.stringify(data))
		})
		await this.http
			.get(`${this.backend}admin/experiencia`)
			.subscribe((data) => {
				localStorage.setItem("experiencia", JSON.stringify(data))
			})
	}

	async refreshToken() {
		const url = this.backend + "auth/refresh-token"
		return this.http.post(url, { id: this.getUser.id })
	}
}
