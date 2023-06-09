import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private backend = environment.backend;

	constructor(private http: HttpClient) {}

	async login(body: any) {
		const url = this.backend +"auth/login";
		return this.http.post(url, body);
	}

	async register(body: any): Promise<any> {
		const url = this.backend +"auth/register";
		return this.http.post(url, body);
	}
}
