import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private backend = environment.backend + 'api/';

  constructor(private http: HttpClient) {}

  private get getUser(): any {
    return JSON.parse(localStorage.getItem('user')!);
  }

  private get token(): any {
    return JSON.parse(localStorage.getItem('token')!);
  }

  async readChats() {
    const url = this.backend + 'chat/readChats';
    return this.http.get(url, {
      headers: { 'x-access-token': this.token },
    });
  }
  async sendMessage(body: any) {
    const url = this.backend + 'chat/sendMessage';
    return this.http.post(url, body, {
      headers: { 'x-access-token': this.token },
    });
  }

  async readMessages(body: any) {
    const url = this.backend + 'chat/getChatByIdUser';
    return this.http.post(url, body, {
      headers: { 'x-access-token': this.token },
    });
  }
  async updateMessage(body: any) {
    const url = this.backend + 'chat/updateMessage';
    return this.http.put(url, body, {
      headers: { 'x-access-token': this.token },
    });
  }

  async getLastMessage(remitente_id: number, destinatario_id: number) {
    const url =
      this.backend + `chat/getLastMessage/${remitente_id}/${destinatario_id}`;
    return this.http
      .get(url, {
        headers: { 'x-access-token': this.token },
      })
      .toPromise();
  }

}
