import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "src/environments/environment"

@Injectable({
	providedIn: "root",
})
export class MatchService {
	private backend = environment.backend
	user = JSON.parse(localStorage.getItem("session")!)

	constructor(private http: HttpClient) {}
  getUser(){
    this.user = JSON.parse(localStorage.getItem("session")!)
  }
	async createMatch(body: any) {
		this.getUser()
    const url = this.backend + "match"
		return this.http.post(url, body, {
			headers: { "x-access-token": this.user.token },
		})
	}
	async readMatch() {
		this.getUser()
    const url = this.backend + "match/" + this.user.user.id
		return this.http.get(url, {
			headers: { "x-access-token": this.user.token },
		})
	}
	async deleteMatch(id: string) {
		this.getUser()
    const url = this.backend + "match/" + id
		return this.http.delete(url, {
			headers: { "x-access-token": this.user.token },
		})
	}
}
