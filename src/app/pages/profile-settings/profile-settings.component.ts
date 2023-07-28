import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { FilesService } from 'src/app/services/files/files.service';
import { MailService } from 'src/app/services/mail/mail.service';
import { UserService } from 'src/app/services/user/user.service';
import { setUser } from 'src/redux/actions';
import { userSelect } from 'src/redux/selectors';
import Swal from 'sweetalert2';
import intlTelInput from 'intl-tel-input';
import  Datepicker  from '@chenfengyuan/datepicker'; // Import Datepicker class


@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements OnInit  {
  idiomas = JSON.parse(localStorage.getItem('lenguajes')!);
  experiencia = JSON.parse(localStorage.getItem('experiencia')!);
  intereses = JSON.parse(localStorage.getItem('interes')!);
  condados = JSON.parse(localStorage.getItem('condados')!);
  conexiones = JSON.parse(localStorage.getItem('conexion')!);
  recharge = true;
  condadoSelected: { nombre: string; ciudades: string[] };
  ciudades: string[] = [];
  TipoConexion: string[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  user$ = this.store.select(userSelect);
  currentUser = JSON.parse(localStorage.getItem('user')!);
  itiInput: any;
  onInformacionBasicaEdit = true;
  onInteresesEdit = true;
  onzonarojaEdit = true;
  isOnResetPassword = false;
  isOnLoadingEmail = false;
  isOnInformacionBasicaLoading = false;
  isOnInteresesLoading = false;
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
    fechaNacimiento: new FormControl(
      this.currentUser.fechaNacimiento.substring(0, 10),
      [Validators.required]
    ),
    genero: new FormControl(this.currentUser.genero, [Validators.required]),
    biografia: new FormControl(this.currentUser.biografia, [
      Validators.required,
    ]),
  });

  interesesFormGroup = new FormGroup({
    temasInteres: new FormControl(this.currentUser.temasInteres, [
      Validators.required,
    ]),
    areaExperiencia: new FormControl(this.currentUser.areaExperiencia, [
      Validators.required,
    ]),
  });

  newEmail = new FormControl(this.currentUser.email, [
    Validators.required,
    Validators.email,
  ]);
  constructor(
    private mailSrvc: MailService,
    private userSrvc: UserService,
    private fileSrvc: FilesService,
    private store: Store<any>
  ) {
    console.log(this.currentUser);
    console.log(this.currentUser.temasInteres);

    const idx = this.condados.findIndex(
      (c: any) => c.nombre === this.currentUser.condado
    );
    this.ciudades = this.condados[idx].ciudades;
    this.condadoSelected = this.condados[idx];
    this.TipoConexion = [...this.currentUser.tipoConexion];
  }
  ngOnInit(): void {
    this.onInputTel();

    // Initialize the datepicker using the Datepicker class
    $('[data-toggle="datepicker"]').datepicker({
      language: 'es-ES',
      startDate: '1900',
      endDate: '2010',
      format: 'yyyy-mm-dd',
      autoHide: true,
      date:this.currentUser,
      autoPick: true,
    });

    // Listen for date changes from the datepicker and update the form control
    $('[data-toggle="datepicker"]').on('pick.datepicker', (e: any) => {
      this.infoBasicaForm.controls.fechaNacimiento.setValue(e.date);
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.onInputTel();
      $('[data-toggle="datepicker"]').datepicker({
        language: 'es-ES',
        startDate: '1900',
        endDate: '2010',
        format: 'yyyy-mm-dd',
        autoHide: true,
        date:this.currentUser,
        autoPick: true,
      });

      $('[data-toggle="datepicker"]').on('pick.datepicker', (e: any) => {
        // e.preventDefault();
        console.log(e);
        this.infoBasicaForm.controls.fechaNacimiento.setValue(e.date);
      });
    }, 2000);
  }
  onInputTel() {
    var inputIti: any = document.querySelector('#phone');
    this.itiInput = intlTelInput(inputIti, {
      utilsScript:
        'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/12.0.3/js/utils.js',
      allowDropdown: true,
      separateDialCode: true,
      initialCountry: 'auto',
      geoIpLookup: function (callback) {
        fetch('https://ipapi.co/json')
          .then(function (res) {
            return res.json();
          })
          .then(function (data) {
            callback(data.country_code);
          })
          .catch(function () {
            callback('us');
          });
      },
    });
    const iti: any = document.querySelector('.iti');
    iti.style.width = '100%';
  }

  onCondadoChange() {
    this.recharge = false;
    console.log(this.ciudades);

    this.ciudades = this.ciudades.filter((c) => true);
  }
  onEditSection(section: string) {
    switch (section) {
      case 'informacionBasica':
        this.onInformacionBasicaEdit = !this.onInformacionBasicaEdit;
        if (!this.onInformacionBasicaEdit) {
          setTimeout(() => {
            // this.onInputTel()
          }, 100);
        }
        break;
      case 'intereses':
        this.onInteresesEdit = !this.onInteresesEdit;
        break;
      case 'zonaroja':
        this.onzonarojaEdit = !this.onzonarojaEdit;
        break;
      default:
        break;
    }

    setTimeout(() => {
      $('select.select2').select2({
        theme: 'classic',
        dropdownAutoWidth: true,
        width: '100%',
        minimumResultsForSearch: Infinity,
      });

      $('select#condado').val(this.infoBasicaForm.get('condado')?.value);

      $('select#condado').on('change', (e: any) => {
        const condado: any = $(e.target).val();
        this.infoBasicaForm.get('condado')?.setValue(condado);
        const idx = this.condados.findIndex((c: any) => c.nombre === condado);
        this.ciudades = this.condados[idx].ciudades;
        this.condadoSelected = this.condados[idx];
        document.getElementById('boton')?.click();
      });

      $('select#ciudad').val(this.infoBasicaForm.get('ciudad')?.value);

      $('select#ciudad').on('change', (e: any) => {
        const ciudad: any = $(e.target).val();

        this.infoBasicaForm.get('ciudad')?.setValue(ciudad);
      });

      $('select#gender').on('change', (e: any) => {
        const genero: any = $(e.target).val();
        this.infoBasicaForm.get('genero')?.setValue(genero);
      });
    }, 5);
  }
  onChangeConexiones(data: any) {
    const value = data.target.value;
    console.log(value);
    if (this.TipoConexion.includes(value)) {
      const idx = this.TipoConexion.findIndex((d) => d == value);
      this.TipoConexion.splice(idx, 1);
    } else {
      this.TipoConexion.push(value);
    }
    console.log(this.TipoConexion);
  }
  async cambioInformacionBasica() {
    this.isOnInformacionBasicaLoading = true;
    const regex = /'(.*?)'/;
    const user: any = { ...this.currentUser };
    let idiomaValue: any = $('select#idioma').val();
    idiomaValue = idiomaValue.map((i: string) => {
      const match = i.match(regex);
      return match ? match[1] : i;
    });
    console.log(this.infoBasicaForm.get('fechaNacimiento')?.value);

    user.nombre = this.infoBasicaForm.get('nombre')?.value;
    user.telefono = this.infoBasicaForm.get('telefono')?.value;
    user.condado = this.infoBasicaForm.get('condado')?.value;
    user.ciudad = this.infoBasicaForm.get('ciudad')?.value;
    user.lenguajes = idiomaValue;
    const date: any = $('[data-toggle="datepicker"]').datepicker('getDate');
    user.fechaNacimiento = new Date(date).toISOString();
    user.genero = this.infoBasicaForm.get('genero')?.value;
    user.biografia = this.infoBasicaForm.get('biografia')?.value;

    var number = this.itiInput.getNumber();
    user.telefono = number;
    console.log(user);

    const res = await this.userSrvc.updateUser(user);
    res.subscribe(
      (data) => {
        console.log(data);
        this.isOnInformacionBasicaLoading = false;
        this.currentUser = user;
        this.store.dispatch(setUser.set(user));
        this.onInformacionBasicaEdit = true;
      },
      (err) => {
        Swal.fire('error', err.error, 'error');
        this.isOnInformacionBasicaLoading = false;
      }
    );
  }
  async cambioIntereses() {
    this.isOnInteresesLoading = true;
    const regex = /'(.*?)'/;
    const user = { ...this.currentUser };
    console.log(user);
    user.tipoConexion = this.TipoConexion;
    let temasInteres: any = $('select#interes').val();
    temasInteres = temasInteres.map((i: string) => {
      const match = i.match(regex);
      return match ? match[1] : i;
    });
    let areaExperiencia: any = $('select#experiencia').val();
    areaExperiencia = areaExperiencia.map((i: string) => {
      const match = i.match(regex);
      return match ? match[1] : i;
    });
    user.temasInteres = temasInteres;
    user.areaExperiencia = areaExperiencia;
    console.log(user);
    const res = await this.userSrvc.updateUser(user);
    res.subscribe(
      (data) => {
        console.log(data);
        this.isOnInteresesLoading = false;
        this.currentUser = user;
        this.store.dispatch(setUser.set(user));
        this.onInteresesEdit = true;
        this.interesesFormGroup
          .get('temasInteres')
          ?.setValue(user.temasInteres);
        this.interesesFormGroup
          .get('areaExperiencia')
          ?.setValue(user.areaExperiencia);
      },
      (err) => {
        Swal.fire('error', err.error, 'error');
        this.isOnInteresesLoading = false;
      }
    );
  }
  async cambioEmail() {
    const res = await this.mailSrvc.changeEmail({
      email: this.currentUser.email,
      newEmail: this.newEmail.value,
    });

    this.isOnLoadingEmail = true;
    res.subscribe(
      (data) => {
        console.log(data);
        this.isOnLoadingEmail = false;
        Swal.fire(
          'Correo enviado',
          `Se ha enviado un correo de confirmación a ${this.newEmail.value}. Acéptalo y cambia tu correo`,
          'success'
        );
        this.newEmail.setValue(this.currentUser.email);
        this.onEditSection('zonaroja');
      },
      (err) => {
        Swal.fire('error', err.error, 'error');
        this.isOnLoadingEmail = false;
      }
    );
  }
  async CambioPassword() {
    this.isOnResetPassword = true;
    const res = await this.mailSrvc.resetPasswordEmail({
      email: this.currentUser.email,
    });
    res.subscribe(
      (data) => {
        this.isOnResetPassword = false;
        Swal.fire(
          'Correo enviado',
          `Se ha enviado un correo de cambio de contraseña a ${this.currentUser.email}. Acéptalo y cambia tu contraseña`,
          'success'
        );
        this.onEditSection('zonaroja');
      },
      (err) => {
        Swal.fire('error', err.error, 'error');
        this.isOnResetPassword = false;
      }
    );
  }
  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  async handleFileInput(event: any) {
    const file = event.target.files[0];
    const res = await this.fileSrvc.updateUser(file);
    res.subscribe(
      (data: any) => {
        console.log(data);

        const user = { ...this.currentUser, avatar: data.path };
        this.currentUser = user;
        this.store.dispatch(setUser.set(user));
      },
      (err) => {
        console.log(err);
        Swal.fire('error', err.error, 'error');
      }
    );
  }
}
