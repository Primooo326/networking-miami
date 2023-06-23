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

  getUser(){
    this.user = JSON.parse(localStorage.getItem("session")!)
  }

	async readUsers() {
		this.getUser()
    const url = this.backend + "users"
		return this.http.get(url, {
			headers: { "x-access-token": this.user.token },
		})
	}
	async updateUser(body: any) {
		this.getUser()
    const url = this.backend + "users"
		return this.http.put(url, body, {
			headers: { "x-access-token": this.user.token },
		})
	}
  async searchUsers(batchsize:number,currentbatch:number,query:string){

    this.getUser()
    const url = this.backend + `users/search?query=${query}&batchsize=${batchsize}&currentbatch=${currentbatch}`
    return this.http.get(url, {
      headers: { "x-access-token": this.user.token },
    })

  }
}
