import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "src/environments/environment"

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private backend = environment.backend + "api/"

	constructor(private http: HttpClient) {}

	async login(body: any) {
		const url = this.backend + "auth/login"

		return this.http.post(url, body)
	}

	async register(body: any): Promise<any> {
		const url = this.backend + "auth/register"
		return this.http.post(url, body)
	}
	async datas() {
		await this.http
			.get("http://localhost:4000/api/admin/interes")
			.subscribe((data) => {
				localStorage.setItem("interes", JSON.stringify(data))
			})
		await this.http
			.get("http://localhost:4000/api/admin/conexion")
			.subscribe((data) => {
				localStorage.setItem("conexion", JSON.stringify(data))
			})
		await this.http
			.get("http://localhost:4000/api/admin/condados")
			.subscribe((data) => {
				localStorage.setItem("condados", JSON.stringify(data))
			})
		await this.http
			.get("http://localhost:4000/api/admin/lenguaje")
			.subscribe((data) => {
				localStorage.setItem("lenguajes", JSON.stringify(data))
			})
		await this.http
			.get("http://localhost:4000/api/admin/experiencia")
			.subscribe((data) => {
				localStorage.setItem("experiencia", JSON.stringify(data))
			})
	}
}
