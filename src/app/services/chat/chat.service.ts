import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "src/environments/environment"

@Injectable({
	providedIn: "root",
})
export class ChatService {
	private backend = environment.backend + "api/"

	constructor(private http: HttpClient) {}
	private get getUser(): any {
		return JSON.parse(localStorage.getItem("user")!)
	}
	private get token(): any {
		return JSON.parse(localStorage.getItem("token")!)
	}
	async readChats() {
		const url = this.backend + "chat/readChats"
		return this.http.get(url, {
			headers: { "x-access-token": this.token },
		})
	}
	async readMessages(body: any) {
		const url = this.backend + "chat/readMessages"
		return this.http.post(url, body, {
			headers: { "x-access-token": this.token },
		})
	}
}
