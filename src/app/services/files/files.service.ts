import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "src/environments/environment"
@Injectable({
  providedIn: 'root'
})
export class FilesService {
	private backend = environment.backend
	private user = JSON.parse(localStorage.getItem("session")!)

	constructor(private http: HttpClient) {}

  private getUser(){
    this.user = JSON.parse(localStorage.getItem("session")!)
  }

	async updateUser(file: File) {
		this.getUser()
    const formData = new FormData();
    formData.append('imagen', file);
    const url = this.backend + "file"
		return this.http.post(url, formData, {
			headers: { "x-access-token": this.user.token },
		})
	}
}
