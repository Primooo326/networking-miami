import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

	private backend = environment.backend;

	constructor(private http: HttpClient) {}

	async readUsers() {
		const url = this.backend +"users";
		return this.http.get(url);
	}

}
