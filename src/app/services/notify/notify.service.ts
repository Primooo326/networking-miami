import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "src/environments/environment"

@Injectable({
	providedIn: "root",
})
export class NotifyService {
	private backend = environment.backend + "api/"

	constructor(private http: HttpClient) {}

	private get token(): any {
		return JSON.parse(localStorage.getItem("token")!)
	}

	async getNorifications() {
		const url = this.backend + "notify"
		return this.http.get(url, {
			headers: { "x-access-token": this.token },
		})
	}
	async deleteNotify(id: number) {
		const url = this.backend + "notify/" + id
		return this.http.delete(url, {
			headers: { "x-access-token": this.token },
		})
	}
}
