import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MailService } from 'src/app/services/mail/mail.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import {
  myMatches,
  myRequestMatches,
  newNotification,
  newPendingMatch,
  setUser,
} from 'src/redux/actions';
import intlTelInput from 'intl-tel-input';
import Swal from 'sweetalert2';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { MatchService } from 'src/app/services/match/match.service';
import { FilesService } from 'src/app/services/files/files.service';
import { environment } from 'src/environments/environment';
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

  hintErrorLength = 'Mínimo 8 caracteres';
  hintErrorRequired = 'Campo requerido';
  hintErrorPassword = 'Las contraseñas no coinciden';
  hintErrorEmail = 'Ingresa un correo válido';

  isOnLogin = true;
  onReset = false;
  isOnResetEmail = false;
  tabRegistro = 'primero';
  pageNumber = '1/5';
  textTabRegistro = 'Correo y contraseña';

  lenguajesV = true;
  experienciaV = true;
  interesesV = true;
  onUserRegister: any;

  itiInput: any;

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
  });

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  contacto1Form = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  contacto2Form = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  contacto3Form = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  emailResetInput = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  pathFile = '';
  onloadFile = false;
  constructor(
    private authSrvc: AuthService,
    private router: Router,
    private mailSrvc: MailService,
    private store: Store<any>,
    private socketSrvc: SocketService,
    private notifySrvc: NotifyService,
    private matchSrvc: MatchService,
    private fileSrvc: FilesService
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

    $('input.select2-search__field').on('keyup', (e: any) => {
      //set input width = 100%
      $(e.target).css('width', '100%');
    });

    //class="select2-search__field"

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
    const iti: any = document.querySelector('.iti');
    iti.style.width = '100%';

    $('[data-toggle="datepicker"]').datepicker({
      language: 'es-ES',
      startDate: '1900',
      endDate: '2010',
      format: 'yyyy-mm-dd',
      autoHide: true,
    });
    $('[data-toggle="datepicker"]').on('pick.datepicker', (e: any) => {
      this.registroForm2Tab.get('fechaNacimiento')?.setValue(e.date);
    });

    $(document).on('change', '.uploadProfileInput', (event) => {
      this.uploadProfileImage(event);
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
                        id: element.id,
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
    const date: any = $('[data-toggle="datepicker"]').datepicker('getDate');
    const newUser: any = {
      ...this.registroForm1Tab.value,
      ...this.registroForm2Tab.value,
      ...registro3Value,
      fechaNacimiento: new Date(date).toISOString(),
      fechaIngreso: new Date().toISOString(),
    };
    var number = this.itiInput.getNumber();
    newUser.telefono = number;
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
            this.onUserRegister = user;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', JSON.stringify(token));
            this.socketSrvc.openSocket();
            this.onChangeTabRegister('cuarto');

              await this.mailSrvc.verifyEmail({
                email: user.email,
              })
          },
          (err: any) => {
            if (err.error == 'User already registered') {
              Swal.fire(
                'Error: Usuario ya registrado',
                'Asegurate de que el correo sea correcto',
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
      this.textTabRegistro = 'Correo y contraseña';
      this.pageNumber = '1/5';
    } else if (tab == 'segundo') {
      this.textTabRegistro = 'Datos personales';
      this.pageNumber = '2/5';
    } else if (tab == 'tercero') {
      this.textTabRegistro = 'Conexiones e intereses';
      this.pageNumber = '3/5';
    } else if (tab == 'cuarto') {
      this.textTabRegistro = 'Sube tu foto de perfil';
      this.pageNumber = '4/5';
    } else if (tab == 'quinto') {
      this.textTabRegistro = 'Invita a tus contactos';
      this.pageNumber = '5/5';
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
  capitalize(str:string) {
    // Dividimos la cadena en palabras individuales
    const words = str.split(' ');

    // Capitalizamos la primera letra de cada palabra
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].slice(1).toLowerCase();
    }

    // Unimos las palabras capitalizadas en una sola cadena
    return words.join(' ');
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
  async uploadProfileImage(event: any) {
    const triggerInput = event.target;
    const currentImg: any = $(triggerInput)
      .closest('.pic-holder')
      .find('.pic')
      .attr('src');
    const holder = $(triggerInput).closest('.pic-holder');
    const wrapper = $(triggerInput).closest('.profile-pic-wrapper');
    $(wrapper).find('[role="alert"]').remove();
    triggerInput.blur();
    const files = !!event.target.files ? event.target.files : [];
    if (!files.length || !window.FileReader) {
      return;
    }
    if (/^image/.test(files[0].type)) {
      this.onloadFile = true;

      const res = await this.fileSrvc.updateUser(files[0]);
      res.subscribe(
        (data: any) => {
          console.log(data);
          this.onloadFile = false;

          $(wrapper).append(
            '<div class="snackbar show" role="alert"><i class="fa mr-3 fa-check-circle text-success"></i>Imagen del perfil agregada correctamente.</div>'
          );
          $(holder).find('.pic').attr('src', data.path);
          this.pathFile = data.path;
          const user = { ...this.onUserRegister, avatar: data.path };
          this.store.dispatch(setUser.set(user));
        },
        (err) => {
          this.onloadFile = false;
          console.log(err);
          $(wrapper).append(
            '<div class="alert mr-3 alert-danger d-inline-block p-2 small" role="alert">Error al subir una imagen.</div>'
          );

          Swal.fire('error', err.error, 'error');
        }
      );
      setTimeout(() => {
        $(wrapper).find('[role="alert"]').remove();
      }, 3000);
    } else {
      $(wrapper).append(
        '<div class="alert alert-danger d-inline-block p-2 small" role="alert">Por favor selecciona una imagen válida.</div>'
      );
      setTimeout(() => {
        $(wrapper).find('[role="alert"]').remove();
      }, 3000);
    }
  }
  async sendContacts() {
    const contactos:any[] = [];
    if (this.contacto1Form.valid) {
      contactos.push(this.contacto1Form.value);
    }
    if (this.contacto2Form.valid) {
      contactos.push(this.contacto2Form.value);
    }
    if (this.contacto3Form.valid) {
      contactos.push(this.contacto3Form.value);
    }

    if (contactos.length > 0) {
      const data = { contactos, user: this.onUserRegister.nombre };
      const res = await this.mailSrvc.sendInvitation(data);
      res.subscribe(
        (data: any) => {
          console.log(data);
        },
        (err) => {
          console.warn(err);
        }
      );
    }
  }
}
