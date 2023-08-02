import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "src/environments/environment"
@Injectable({
	providedIn: "root",
})
export class FilesService {
	private backend = environment.backend + "api/"

	constructor(private http: HttpClient) {}

	private get token(): any {
		return JSON.parse(localStorage.getItem("token")!)
	}

	async updateUser(file: File) {
		const formData = new FormData()
		formData.append("imagen", file)
		const url = this.backend + "file/avatar"
		return this.http.post(url, formData, {
			headers: { "x-access-token": this.token },
		})
	}
}
