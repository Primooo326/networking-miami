import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MailService } from 'src/app/services/mail/mail.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import {
  myRequestMatches,
  newNotification,
  newPendingMatch,
  setUser,
} from 'src/redux/actions';
import intlTelInput from 'intl-tel-input';
import Swal from 'sweetalert2';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { MatchService } from 'src/app/services/match/match.service';
import { environment } from 'src/environments/environment';
import 'select2';
import { FilePondOptions } from 'filepond';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  title = 'Networking Miami | Ingreso';
  idiomas = JSON.parse(localStorage.getItem('lenguajes')!).sort();
  experiencia = JSON.parse(localStorage.getItem('experiencia')!).sort();
  intereses = JSON.parse(localStorage.getItem('interes')!).sort();
  condados = JSON.parse(localStorage.getItem('condados')!).sort();
  conexiones = JSON.parse(localStorage.getItem('conexion')!).sort();
  condadoSelected: { nombre: string; ciudades: string[] };
  ciudades: string[] = [];
  TipoConexion: string[] = [];
  backend = environment.backend + 'api/file';

  hintErrorLength = 'Mínimo 8 caracteres';
  hintErrorRequired = 'Campo requerido';
  hintErrorPassword = 'Las contraseñas no coinciden';
  hintErrorEmail = 'Ingresa un correo válido';
  isOnLogin = true;
  onReset = false;
  isOnResetEmail = false;
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
    check: new FormControl('', [Validators.requiredTrue]),
  });

  registroForm2Tab = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(8)]),
    fechaNacimiento: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),

    telefono: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    genero: new FormControl('', [Validators.required]),
    condado: new FormControl('', [Validators.required]),
    ciudad: new FormControl('', [Validators.required]),
    lenguajes: new FormControl(''),
    biografia: new FormControl('', [Validators.required]),
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
  showPasswordLogin: boolean = false;
  showPasswordRegister: boolean = false;
  token = 'aun sin token';

  constructor(
    private authSrvc: AuthService,
    private mailSrvc: MailService,
    private store: Store<any>,
    private socketSrvc: SocketService,
    private notifySrvc: NotifyService,
    private matchSrvc: MatchService,
    private titleService: Title
  ) {
    console.log(this.conexiones);
    this.titleService.setTitle(this.title);
    setInterval(() => {
      this.experienciaV =
        this.registroForm3Tab.controls.areaExperiencia.value?.length == 0;

      this.interesesV =
        this.registroForm3Tab.controls.temasInteres.value?.length == 0;

      this.lenguajesV =
        this.registroForm2Tab.controls.lenguajes.value?.length == 0;
    }, 100);

    this.condadoSelected = this.condados[0];
    this.ciudades = this.condados[0].ciudades.sort();
    // organiza items y el item "Otros" al final
    this.experiencia.sort();
    const idx = this.experiencia.findIndex((e) => e == 'Otro');
    this.experiencia.splice(idx, 1);
    this.experiencia.push('Otro');

    this.intereses.sort();
    const idx2 = this.intereses.findIndex((e) => e == 'Otros');
    this.intereses.splice(idx2, 1);
    this.intereses.push('Otros');
  }

  ngAfterViewInit(): void {
    const matchCustom = (params, data) => {
      // Si el término de búsqueda está en blanco, devuelve todos los datos sin filtrar
      if ($.trim(params.term) === '') {
        return data;
      }

      // Comprueba si el objeto "data" tiene la propiedad "text"
      if (typeof data.text === 'undefined') {
        return null;
      }

      // Convierte el término de búsqueda y el texto en minúsculas para hacer una comparación insensible a mayúsculas y minúsculas
      const searchTerm = params.term.toLowerCase();
      const dataText = data.text.toLowerCase();

      // Comprueba si el término de búsqueda se encuentra en el texto
      if (dataText.includes(searchTerm)) {
        // Crea una copia profunda del objeto "data" usando el spread operator
        const modifiedData = { ...data };

        return modifiedData;
      }

      return null;
    };

    $('select.select2').select2({
      theme: 'classic',
      width: '100%',
      matcher: matchCustom,
    });

    $('input.select2-search__field').on('keyup', (e: any) => {
      $(e.target).css('width', '100%');
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
      this.ciudades = this.condados[idx].ciudades.sort();
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
      //lenguaje en español

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
      format: 'dd/mm/yyyy',
      autoHide: true,
    });
    $('[data-toggle="datepicker"]').on('pick.datepicker', (e: any) => {
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
              location.reload();

              // this.router.navigate(['/home']);
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
  async register() {
    const registro3Value: any = this.registroForm3Tab.value;
    registro3Value.tipoConexion = this.TipoConexion;
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
    newUser.email = newUser.email.toLowerCase();
    await this.authSrvc.register(newUser).then(
      (obs) => {
        obs.subscribe(
          async (data: any) => {
            const { token, id, avatar, fotoPortada } = data;
            const user = newUser;
            delete user.password;
            delete user.repeatPassword;
            user.id = id;
            user.avatar = avatar;
            user.fotoPortada = fotoPortada;
            user.verificado = 0;
            this.store.dispatch(setUser.set(user));
            this.onUserRegister = user;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', JSON.stringify(token));
            (this.pondOptionsAvatar.server = {
              url: this.backend,
              process: {
                url: '/avatar',
                headers: {
                  'x-access-token': token,
                },
                method: 'POST',
                onload: this.setAvatar.bind(this),
              },
              revert: {
                url: '/avatar',
                headers: {
                  'x-access-token': token,
                },
                method: 'DELETE',
                onload: this.deleteAvatar.bind(this),
              },
            }),
              this.socketSrvc.openSocket();
            setTimeout(() => {
              this.onChangeTabRegister('4/5');
            }, 200);

            const mail = await this.mailSrvc.verifyEmail({
              email: user.email,
            });
            mail.subscribe(
              (data) => {},
              (err) => {
                console.log(err);
              }
            );
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
          Swal.fire(
            '¡Éxito!',
            'Se ha enviado un correo a tu bandeja de entrada',
            'success'
          );
        },
        (err) => {
          Swal.fire('error', err.error, 'error');
          this.isOnResetEmail = false;
        }
      );
    }
  }
  async sendContacts() {
    const contactos: any[] = [];
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
  showPasswordLoginFn() {
    this.showPasswordLogin = !this.showPasswordLogin;
    const passwordLogin: any = document.getElementById('passwordLogin');
    if (this.showPasswordLogin) {
      passwordLogin!.type = 'text';
    } else {
      passwordLogin!.type = 'password';
    }
  }
  showPasswordRegisterFn() {
    this.showPasswordRegister = !this.showPasswordRegister;
    const passwordRegister: any = document.getElementById('passwordRegister');
    const repeatPasswordRegister: any = document.getElementById(
      'repeatPasswordRegister'
    );
    if (this.showPasswordRegister) {
      passwordRegister!.type = 'text';
      repeatPasswordRegister!.type = 'text';
    } else {
      passwordRegister!.type = 'password';
      repeatPasswordRegister!.type = 'password';
    }
  }

  onChangeTabRegister(tab: string) {
    this.pageNumber = tab;
    if (tab == '1/5') {
      this.textTabRegistro = 'Correo y contraseña';
    } else if (tab == '2/5') {
      this.textTabRegistro = 'Datos personales';
    } else if (tab == '3/5') {
      this.textTabRegistro = 'Conexiones e intereses';
    } else if (tab == '4/5') {
      this.textTabRegistro = 'Sube tu foto de perfil';
    } else if (tab == '5/5') {
      this.textTabRegistro = 'Invita a tus contactos';
    }
    this.scrollToTop();
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
  capitalize(str: string) {
    // Dividimos la cadena en palabras individuales
    const words = str.split(' ');

    // Capitalizamos la primera letra de cada palabra
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].slice(1).toLowerCase();
    }

    // Unimos las palabras capitalizadas en una sola cadena
    return words.join(' ');
  }

  // !filepond
  @ViewChild('myPondAvatar') myPondAvatar!: any;

  pondOptionsAvatar: FilePondOptions = {
    name: 'imagen',
    allowMultiple: false,
    allowImagePreview: true,
    imageResizeMode: 'cover',
    stylePanelLayout: 'compact circle',
    allowImageExifOrientation: true,
    labelIdle:
      'Arrastra y suelta tus archivos o click para subir... <br/> (Max 2MB)',
    acceptedFileTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
    ],
    labelFileTypeNotAllowed: 'Solo se permiten imágenes',
    labelFileProcessingComplete: 'Imagen subida correctamente',
    labelFileProcessingError: 'Error al subir la imagen',
    labelTapToCancel: 'click para cancelar',
    labelTapToRetry: 'click para reintentar',
    labelTapToUndo: 'click para deshacer',
    labelButtonRemoveItem: 'Eliminar',
    labelButtonAbortItemLoad: 'Abortar',
    labelFileProcessing: 'Subiendo',
    labelFileProcessingAborted: 'Subida cancelada',
    imagePreviewHeight: 170,
    imageResizeTargetWidth: 200,
    imageResizeTargetHeight: 200,
    styleLoadIndicatorPosition: 'center bottom',
    styleButtonRemoveItemPosition: 'center bottom',

    server: {
      url: this.backend,
      process: {
        url: '/avatar',
        headers: {
          'x-access-token': `${JSON.parse(localStorage.getItem('token')!)}`,
        },
        method: 'POST',
        onload: this.setAvatar.bind(this),
      },
      revert: {
        url: '/avatar',
        headers: {
          'x-access-token': `${JSON.parse(localStorage.getItem('token')!)}`,
        },
        method: 'DELETE',
        onload: this.deleteAvatar.bind(this),
      },
    },
    onaddfile: this.beforeAddFileAvatar.bind(this),
  };
  setAvatar(response): any {
    const path = JSON.parse(response).path;
    const user = { ...this.onUserRegister, avatar: path };
    this.onUserRegister = user;
    this.pathFile = path;
    this.store.dispatch(setUser.set(user));
  }
  deleteAvatar(response): any {
    const path = JSON.parse(response).path;
    const user = { ...this.onUserRegister, avatar: path };
    this.onUserRegister = user;
    this.pathFile = '';
    this.store.dispatch(setUser.set(user));
    this.myPondAvatar.removeFile();
  }
  beforeAddFileAvatar(err, file: any) {
    console.log(file);
    if (file.fileSize > 2000000) {
      Swal.fire('¡Error!', 'La imagen no puede pesar más de 2MB', 'error');
      this.myPondAvatar.removeFile();
      return false;
    }
    return true;
  }

  //!Validadores

  emailLoginValidator(): boolean {
    return (
      this.loginForm.controls.email.hasError('required') ||
      this.loginForm.controls.email.hasError('email')
    );
  }
  passwordLoginValidator(): boolean {
    return (
      this.loginForm.controls.password.hasError('required') ||
      this.loginForm.controls.password.hasError('minlength')
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
  manejarKeydown(event: KeyboardEvent) {
    const valorCampo = (event.target as HTMLInputElement).value;
    if (event.key == 'Backspace') {
      this.registroForm2Tab.controls.fechaNacimiento.setValue(valorCampo);
      return;
    } else {
      // Obtener el valor actual del campo de entrada
      const input: HTMLInputElement = document.getElementById(
        'date'
      ) as HTMLInputElement;
      const dateString: HTMLInputElement = document.getElementById(
        'dateString'
      ) as HTMLInputElement;
      // Verificar si el evento es un número y si el valor actual tiene cierta longitud
      valorCampo.replace('/', '');
      if ([4, 7].includes(valorCampo.length)) {
        // Agregar automáticamente el carácter "-" después de ciertos caracteres
        console.log(valorCampo + '-');
        input!.value = valorCampo + '-';
        dateString!.value = valorCampo + '-';
        return this.registroForm2Tab.controls.fechaNacimiento.setValue(
          valorCampo + '-'
        );
      }
      this.registroForm2Tab.controls.fechaNacimiento.setValue(valorCampo);
    }
  }
  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
