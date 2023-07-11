import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "src/environments/environment"
import { SocketService } from "../socket/socket.service"

@Injectable({
	providedIn: "root",
})
export class MatchService {
	private backend = environment.backend + "api/"

	constructor(private http: HttpClient) {}

	private get getUser(): any {
		return JSON.parse(localStorage.getItem("user")!)
	}
	private get token(): any {
		return JSON.parse(localStorage.getItem("token")!)
	}
	async createMatch(body: any) {
		const url = this.backend + "match"
		return this.http.post(url, body, {
			headers: { "x-access-token": this.token },
		})
	}
	async requestMatch(body: any) {
		const url = this.backend + "match/request"
		return this.http.post(url, body, {
			headers: { "x-access-token": this.token },
		})
	}
	async readPendingMatch() {
		const url = this.backend + "match/pendingmatches"
		return this.http.get(url, {
			headers: { "x-access-token": this.token },
		})
	}
	async readrequestMatches() {
		const url = this.backend + "match/requestmatches"
		return this.http.get(url, {
			headers: { "x-access-token": this.token },
		})
	}
	async readMatch() {
		const url = this.backend + "match/" + this.getUser.id
		return this.http.get(url, {
			headers: { "x-access-token": this.token },
		})
	}
	async deleteRequestMatch(id: string) {
		const url = this.backend + "match/deleteRequestMatch/" + id
		return this.http.delete(url, {
			headers: { "x-access-token": this.token },
		})
	}
	async rejectPendingMatch(id: string) {
		const url = this.backend + "match/rejectPendingMatch/" + id
		return this.http.delete(url, {
			headers: { "x-access-token": this.token },
		})
	}
	async deleteMatch(id: string) {
		const url = this.backend + "match/deleteMatch/" + id
		return this.http.delete(url, {
			headers: { "x-access-token": this.token },
		})
	}
}
