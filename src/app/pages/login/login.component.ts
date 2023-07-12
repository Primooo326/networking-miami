import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MailService } from 'src/app/services/mail/mail.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { myMatches, myRequestMatches, newNotification, newPendingMatch, setUser } from 'src/redux/actions';
import intlTelInput from 'intl-tel-input';

import Swal from 'sweetalert2';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { MatchService } from 'src/app/services/match/match.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  idiomas = JSON.parse(localStorage.getItem('lenguajes')!);
  experiencia = JSON.parse(localStorage.getItem('experiencia')!);
  intereses = JSON.parse(localStorage.getItem('interes')!);
  condados = JSON.parse(localStorage.getItem('condados')!);

  condadoSelected: { nombre: string; ciudades: string[] };
  ciudades: string[] = [];
  TipoConexion: string[] = [];

  hintErrorLength = 'Minimo 8 caracteres';
  hintErrorRequired = 'Campo requerido';
  hintErrorPassword = 'Las contraseñas no coinciden';
  hintErrorEmail = 'Ingresa un correo valido';

  isOnLogin = true;
  onReset = false;
  isOnResetEmail = false;
  tabRegistro = 'primero';
  textTabRegistro = 'Correo y contraseña 1/3';

  lenguajesV = true;
  experienciaV = true;
  interesesV = true;


  itiInput:any


  registroForm1Tab = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    repeatPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  registroForm2Tab = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(8)]),
    fechaNacimiento: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    genero: new FormControl('', [Validators.required]),
    condado: new FormControl('', [Validators.required]),
    ciudad: new FormControl('', [Validators.required]),
    lenguajes: new FormControl(''),
    biografia: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  registroForm3Tab = new FormGroup({
    areaExperiencia: new FormControl(''),
    temasInteres: new FormControl(''),
    objetivo: new FormControl('', [Validators.required]),
  });

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  emailResetInput = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(
    private authSrvc: AuthService,
    private router: Router,
    private mailSrvc: MailService,
    private store: Store<any>,
    private socketSrvc: SocketService,
    private notifySrvc:NotifyService,
    private matchSrvc: MatchService
  ) {
    setInterval(() => {
      this.experienciaV =
        this.registroForm3Tab.controls.areaExperiencia.value?.length == 0;

      this.interesesV =
        this.registroForm3Tab.controls.temasInteres.value?.length == 0;

      this.lenguajesV =
        this.registroForm2Tab.controls.lenguajes.value?.length == 0;
    }, 100);

    this.condadoSelected = this.condados[0];
    this.ciudades = this.condados[0].ciudades;
  }

  ngAfterViewInit(): void {
    $('select.select2').select2({
      theme: 'classic',
      dropdownAutoWidth: true,
      width: '100%',
      minimumResultsForSearch: Infinity,
    });

    $('select#ciudad').on('change', (e: any) => {
      const ciudad: any = $(e.target).val();
      this.registroForm2Tab.get('ciudad')?.setValue(ciudad);
    });
    $('select#condado').on('change', (e: any) => {
      const condado: any = $(e.target).val();
      this.registroForm2Tab.get('condado')?.setValue(condado);
    });
    $('select#condado').on('change', (e: any) => {
      const condado: any = $(e.target).val();
      this.registroForm2Tab.get('condado')?.setValue(condado);
      const idx = this.condados.findIndex((c: any) => c.nombre === condado);
      this.ciudades = this.condados[idx].ciudades;
      this.condadoSelected = this.condados[idx];
      document.getElementById('boton')?.click();
    });
    $('select#idioma').on('change', (e: any) => {
      const lenguajes: any = $(e.target).val();
      this.registroForm2Tab.get('lenguajes')?.setValue(lenguajes);
    });
    $('select#gender').on('change', (e: any) => {
      const genero: any = $(e.target).val();
      this.registroForm2Tab.get('genero')?.setValue(genero);
    });
    $('select#experiencia').on('change', (e: any) => {
      const experiencia: any = $(e.target).val();
      this.registroForm3Tab.get('areaExperiencia')?.setValue(experiencia);
    });
    $('select#interes').on('change', (e: any) => {
      const temasInteres: any = $(e.target).val();
      this.registroForm3Tab.get('temasInteres')?.setValue(temasInteres);
    });
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
    const iti:any = document.querySelector('.iti');
    iti.style.width = '100%';

    $('[data-toggle="datepicker"]').datepicker({
      language: 'es-ES',
      startDate:"1900",
      endDate:"2010",
      format: 'yyyy-mm-dd',
      autoHide: true,
    });
    $('[data-toggle="datepicker"]').on("pick.datepicker", (e:any) => {
      this.registroForm2Tab.get('fechaNacimiento')?.setValue(e.date);
    });

  }

  async login() {
    if (this.loginForm.valid) {
      await this.authSrvc
        .login({
          email: this.loginForm.value.email,
          password: this.loginForm.value.password,
        })
        .then((obs) => {
          obs.subscribe(
            async (data: any) => {
              console.log(data);
              const { token, user } = data;
              this.store.dispatch(setUser.set(user));

              localStorage.setItem('user', JSON.stringify(user));
              localStorage.setItem('token', JSON.stringify(token));
              this.socketSrvc.openSocket();

              const notifiys = await this.notifySrvc.getNorifications();
              notifiys.subscribe(
                (data: any) => {
                  data.forEach((element: any) => {
                    this.store.dispatch(
                      newNotification.set({
                        data: element.data,
                        title: element.title,
                        message: element.message,
                        time: element.time,
                      })
                    );
                  });
                },
                (err: any) => {
                  console.log(err);
                }
              );
              const matchesPending = await this.matchSrvc.readPendingMatch();
              matchesPending.subscribe((data: any) => {
                data.forEach((element: any) => {
                  this.store.dispatch(newPendingMatch.set(element));
                });
              });
              const matchesRequest = await this.matchSrvc.readrequestMatches();
              matchesRequest.subscribe((data: any) => {
                data.forEach((element: any) => {
                  this.store.dispatch(myRequestMatches.set(element));
                });
              });

              this.router.navigate(['/home']);


            },
            (err) => {
              console.log(err);
              if (err.error == 'Invalid password') {
                Swal.fire(
                  'Error: Contraseña incorrecta',
                  'Asegúrate de que tu contraseña sea correcta',
                  'error'
                );
              } else if (err.error == 'User does not exist') {
                Swal.fire(
                  'Error: Usuario no existe',
                  'Asegúrate de que tu correo sea correcto',
                  'error'
                );
              } else {
                Swal.fire('Error', err.message, 'error');
              }
            }
          );
        });
    }
  }
  async register(registro3Value: any) {
    const date:any = $('[data-toggle="datepicker"]').datepicker('getDate')
    const newUser: any = {
      ...this.registroForm1Tab.value,
      ...this.registroForm2Tab.value,
      ...registro3Value,
      fechaNacimiento: new Date(
        date
      ).toISOString(),
      fechaIngreso: new Date().toISOString(),
    };
    var number = this.itiInput.getNumber();
    newUser.telefono = number;
    newUser.fecha;
    await this.authSrvc.register(newUser).then(
      (obs) => {
        obs.subscribe(
          async (data: any) => {
            console.log(data);
            const { token, id, avatar, fotoPortada } = data;
            const user = newUser;
            user.id = id;
            user.avatar = avatar;
            user.fotoPortada = fotoPortada;
            user.verificado = 0;
            this.store.dispatch(setUser.set(user));
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', JSON.stringify(token));
            this.socketSrvc.openSocket();
            this.router.navigate(['/home']);
          },
          (err: any) => {
            if (err.error == 'User already registered') {
              Swal.fire(
                'Error: User already registered',
                'Make sure your email is correct',
                'error'
              );
            } else {
              Swal.fire('Error', err.message, 'error');
            }
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );

    console.log(newUser);
  }
  async reset() {
    if (this.emailResetInput.valid) {
      this.isOnResetEmail = true;
      const res = await this.mailSrvc.resetPasswordEmail({
        email: this.emailResetInput.value,
      });
      res.subscribe(
        (data) => {
          console.log(data);
          this.isOnResetEmail = false;
        },
        (err) => {
          Swal.fire('error', err.error, 'error');
          this.isOnResetEmail = false;
        }
      );
    }
  }

  register1Tab() {
    console.log(this.registroForm1Tab.value);
    this.onChangeTabRegister('segundo');
  }
  register2Tab() {

    console.log(this.registroForm2Tab.value);

    var number = this.itiInput.getNumber();
    console.log(number);
    this.onChangeTabRegister('tercero');
  }
  register3Tab() {
    const registro3Value: any = this.registroForm3Tab.value;
    registro3Value.tipoConexion = this.TipoConexion;
    console.log(registro3Value);
    this.register(registro3Value);
  }

  onChangeTabRegister(tab: string) {
    this.tabRegistro = tab;
    if (tab == 'primero') {
      this.textTabRegistro = 'Correo y contraseña 1/3';
    } else if (tab == 'segundo') {
      this.textTabRegistro = 'Datos personales 2/3';
    } else if (tab == 'tercero') {
      this.textTabRegistro = 'Conexiones e intereses 3/3';
    }
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

  //!Validadores

  emailLoginValidator(): boolean {
    return (
      (!this.registroForm1Tab.controls.email.dirty &&
        this.registroForm1Tab.controls.email.hasError('required')) ||
      this.registroForm1Tab.controls.email.hasError('email')
    );
  }
  passwordLoginValidator(): boolean {
    return (
      this.registroForm1Tab.controls.password.hasError('required') ||
      this.registroForm1Tab.controls.password.hasError('minlength') ||
      this.registroForm1Tab.controls.password.value !==
        this.registroForm1Tab.controls.repeatPassword.value
    );
  }

  emailRegistroValidator(): boolean {
    return (
      this.registroForm1Tab.controls.email.hasError('required') ||
      this.registroForm1Tab.controls.email.hasError('email')
    );
  }
  passwordRegistroValidator(): boolean {
    return (
      this.registroForm1Tab.controls.password.hasError('required') ||
      this.registroForm1Tab.controls.password.hasError('minlength') ||
      this.registroForm1Tab.controls.password.value !==
        this.registroForm1Tab.controls.repeatPassword.value
    );
  }
  nameRegistroValidator(): boolean {
    return (
      this.registroForm2Tab.controls.nombre.hasError('required') ||
      this.registroForm2Tab.controls.nombre.hasError('minlength')
    );
  }
  phoneRegistroValidator(): boolean {
    return (
      this.registroForm2Tab.controls.telefono.hasError('required') ||
      this.registroForm2Tab.controls.telefono.hasError('minlength')
    );
  }
  birthdateRegistroValidator(): boolean {
    return this.registroForm2Tab.controls.fechaNacimiento.hasError('required');
  }
  genderRegistroValidator(): boolean {
    return this.registroForm2Tab.controls.genero.hasError('required');
  }
  cityRegistroValidator(): boolean {
    return this.registroForm2Tab.controls.ciudad.hasError('required');
  }
  lenguajesRegistroValidator() {
    this.lenguajesV =
      this.registroForm2Tab.controls.lenguajes.value?.length == 0;
    console.log(this.lenguajesV);
  }
  biographyRegistroValidator(): boolean {
    return this.registroForm2Tab.controls.biografia.hasError('required');
  }
}
