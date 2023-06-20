import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "src/environments/environment"

@Injectable({
	providedIn: "root",
})
export class UserService {
	private backend = environment.backend
	user = JSON.parse(localStorage.getItem("session")!)

	constructor(private http: HttpClient) {}

	async readUsers() {
		const url = this.backend + "users"
		return this.http.get(url, {
			headers: { "x-access-token": this.user.token },
		})
	}
	async updateUser(body: any) {
		const url = this.backend + "users"
		return this.http.put(url, body, {
			headers: { "x-access-token": this.user.token },
		})
	}
}
