import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Usuario } from "src/app/tools/models"
import { environment } from "src/environments/environment"

@Injectable({
	providedIn: "root",
})
export class UserService {
	private backend = environment.backend + "api/"
	constructor(private http: HttpClient) {}

	private get token(): any {
		return JSON.parse(localStorage.getItem("token")!)
	}

	async readUsers() {
		const url = this.backend + "users"
		return this.http.get(url, {
			headers: { "x-access-token": this.token },
		})
	}
	async readSimilarUsers(user: Usuario) {
		const url = this.backend + "users/readSimilarUsers"
		return this.http.post(url, user, {
			headers: { "x-access-token": this.token },
		})
	}
	async readAllUsers() {
		const url = this.backend + "users/all"
		return this.http.get(url)
	}
	async updateUser(body: any) {
		const url = this.backend + "users"
		return this.http.put(url, body, {
			headers: { "x-access-token": this.token },
		})
	}
	async getUserById(id: any) {
		const url = this.backend + "users/" + "userById/" + id
		return this.http.get(url, {
			headers: { "x-access-token": this.token },
		})
	}
	async searchUsers(batchsize: number, currentbatch: number, query: string) {
		const url =
			this.backend +
			`users/search?query=${query}&batchsize=${batchsize}&currentbatch=${currentbatch}`
		return this.http.get(url, {
			headers: { "x-access-token": this.token },
		})
	}
	async searchUsersbyparameters(data: any) {
		const url = this.backend + `users/searchbyparameters`
		return this.http.post(url, data, {
			headers: { "x-access-token": this.token },
		})
	}
	async deleteUser(id: number) {
		const url = this.backend + "users/eliminarUsuario"
		return this.http.post(
			url,
			{ id: id },
			{
				headers: { "x-access-token": this.token },
			},
		)
	}
}
