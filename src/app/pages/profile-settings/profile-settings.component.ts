import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent {
  currentUser = JSON.parse(localStorage.getItem('session')!);
  infoBasicaForm = new FormGroup({
    nombre: new FormControl(this.currentUser.nombre, [
      Validators.required,
      Validators.minLength(3),
    ]),
    telefono: new FormControl(this.currentUser.telefono, [
      Validators.required,
      Validators.minLength(8),
    ]),
    condado: new FormControl(this.currentUser.condado, [Validators.required]),
    ciudad: new FormControl(this.currentUser.ciudad, [Validators.required]),
    lenguajes: new FormControl(this.currentUser.lenguajes, [
      Validators.required,
    ]),
    fechaNacimiento: new FormControl(this.currentUser.fechaNacimiento, [
      Validators.required,
    ]),
    genero: new FormControl(this.currentUser.genero, [Validators.required]),
    biografia: new FormControl(this.currentUser.biografia, [
      Validators.required,
    ]),
  });
  constructor() {
    console.log(this.currentUser.user);
  }
}
