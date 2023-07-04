import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class MailService {
  private backend = environment.backend + "api/";

  constructor(private http: HttpClient) {}

  async verifyEmail(body: any) {
    const url = this.backend + 'mail/verificationmail';
    return this.http.post(url, body);
  }
  async resetPasswordEmail(body: any) {
    const url = this.backend + 'mail/resetpassword';
    return this.http.post(url, body);
  }
  async changeEmail(body: any) {
    const url = this.backend + 'mail/changemail';
    return this.http.post(url, body);
  }
}
