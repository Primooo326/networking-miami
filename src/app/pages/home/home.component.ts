import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MailService } from 'src/app/services/mail/mail.service';
import { UserService } from 'src/app/services/user/user.service';
import { Usuario } from 'src/app/tools/models';
import Swal from 'sweetalert2';
import Masonry from 'masonry-layout';
import { Store } from '@ngrx/store';
import {
  matchPendingSelect,
  matchRequestSelect,
  matchSelect,
} from 'src/redux/selectors';
import { ETypePerfil } from 'src/app/tools/models';
import { myRequestMatches } from 'src/redux/actions';
import { userSelect } from '../../../redux/selectors';
import { frases } from 'src/assets/utilities';
import 'select2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  idiomas = JSON.parse(localStorage.getItem('lenguajes')!).sort();
  experiencia = JSON.parse(localStorage.getItem('experiencia')!).sort();
  intereses = JSON.parse(localStorage.getItem('interes')!).sort();
  condados = JSON.parse(localStorage.getItem('condados')!).sort();
  conexion = JSON.parse(localStorage.getItem('conexion')!).sort();
  conexion2 = [
    {
      searchBy: 'personas que quieran compartir su conocimiento.',
      value: 'Estoy buscando compartir o adquirir conocimiento',
    },
    {
      searchBy: 'personas con intereses similares.',
      value: 'Quiero conectar con personas con intereses similares.',
    },
    {
      searchBy: 'personas que estén buscando nuevas conexiones.',
      value: 'Estoy buscando nuevas conexiones.',
    },
    {
      searchBy: 'personas que estén buscando trabajo.',
      value: 'Estoy buscando trabajo.',
    },
    {
      searchBy: 'personas que estén buscando nuevas oportunidades de negocio.',
      value: 'Estoy buscando nuevas oportunidades de negocio.',
    },
    {
      searchBy: 'personas que estén buscando productos nuevos y únicos.',
      value: 'Estoy buscando productos nuevos y únicos.',
    },
    {
      searchBy:
        'personas que estén buscando una comunidad de la que formar parte.',
      value: 'Estoy buscando una comunidad de la que formar parte.',
    },
  ];
  condadoSelected: { nombre: string; ciudades: string[] } | string = '';
  ciudades: string[] = [];
  verificado = false;
  onVerifyEmail = false;
  currentPageNewMatches = 1;
  showUsersNewMatches: any[] = [];
  users: Usuario[] = [];
  orderBy = 'Todos los miembros';
  messageFilter = 'usuarios encontrados con intereses similares';
  onLoadUsers = true;
  pages: number[] = [];
  contactoForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });
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
  solicitudesDeMatch: Usuario[] = [];
  peticionesDeMatch: Usuario[] = [];
  contactos: Usuario[] = [];

  isOnAdvancedFilters = false;

  filterInput = new FormControl('', Validators.required);

  filtersGroup = new FormGroup({
    condado: new FormControl('', Validators.required),
    ciudad: new FormControl('', Validators.required),
    idiomas: new FormControl('', Validators.required),
    experiencia: new FormControl('', Validators.required),
    conexiones: new FormControl('', Validators.required),
  });

  currentUser = JSON.parse(localStorage.getItem('user')!);
  constructor(
    private userSrvc: UserService,
    private mailSrvc: MailService,
    private store: Store<any>
  ) {}
  async ngOnInit() {
    this.store.select(userSelect).subscribe((user: Usuario) => {
      this.currentUser = user;
      this.verificado = user.verificado == 0 ? false : true;
    });
    this.store.select(matchPendingSelect).subscribe((users: any) => {
      this.solicitudesDeMatch = users;
      this.readSimilarUsers();
    });
    this.store.select(matchRequestSelect).subscribe((users: any) => {
      this.peticionesDeMatch = users;
    });
    this.store.select(matchSelect).subscribe((users: any) => {
      this.contactos = users;
    });

    this.currentUser.verificado == 0
      ? (this.verificado = false)
      : (this.verificado = true);

    await this.readSimilarUsers();

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
    $('select#ciudad').on('change', (e: any) => {
      const ciudad: any = $(e.target).val();
      this.filtersGroup.get('ciudad')?.setValue(ciudad);
    });
    $('select#condado').on('change', (e: any) => {
      const condado: any = $(e.target).val();
      this.filtersGroup.get('condado')?.setValue(condado);
    });
    $('select#condado').on('change', (e: any) => {
      const condado: any = $(e.target).val();
      this.filtersGroup.get('condado')?.setValue(condado);
      if (condado) {
        const idx = this.condados.findIndex((c: any) => c.nombre === condado);
        this.ciudades = this.condados[idx].ciudades.sort();
        this.condadoSelected = this.condados[idx];
        document.getElementById('boton')?.click();
      }
    });
    $('select#idiomas').on('change', (e: any) => {
      const idiomas: any = $(e.target).val();
      this.filtersGroup.get('idiomas')?.setValue(idiomas);
    });
    $('select#experiencia').on('change', (e: any) => {
      const experiencia: any = $(e.target).val();
      this.filtersGroup.get('experiencia')?.setValue(experiencia);
    });
    $('select#conexiones').on('change', (e: any) => {
      const conexiones: any = $(e.target).val();
      this.filtersGroup.get('conexiones')?.setValue(conexiones);
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      $('#preloader').fadeOut('slow', function () {
        $(this).remove();
      });
    }, 2000);
  }
  async readSimilarUsers() {
    await this.userSrvc.readSimilarUsers(this.currentUser).then((obs) =>
      obs.subscribe((data: any) => {
        this.users = data.sort((a, b) => {
          if (
            this.typeUser(a) == 'solicitud' &&
            this.typeUser(b) != 'solicitud'
          )
            return -1;
          else return 1;
        });

        while (this.pages.length < this.users.length / 4) {
          this.pages.push(this.pages.length);
        }
        this.changePageNewMatches(0);
        this.onLoadUsers = false;
      })
    );
  }
  async verifyEmail() {
    this.onVerifyEmail = true;
    const res = await this.mailSrvc.verifyEmail({
      email: this.currentUser.email,
    });
    res.subscribe(
      (data) => {
        this.onVerifyEmail = false;
        Swal.fire(
          'Correo reenviado',
          `Se ha reenviado un correo a ${this.currentUser.email}. Acéptalo y verifica tu cuenta`,
          'success'
        );
      },
      (err) => {
        Swal.fire('error', err.error, 'error');
        this.onVerifyEmail = false;
      }
    );
  }
  onAdvanceFilters() {
    this.isOnAdvancedFilters = !this.isOnAdvancedFilters;
    // this.initMasonry()
  }

  async applyFilter() {
    const filter = this.filterInput.value?.trim();
    if (filter!.length != 0) {
      this.onLoadUsers = true;
      const res = await this.userSrvc.searchUsers(50, 0, filter!);
      res.subscribe(
        (data: any) => {
          this.messageFilter = 'usuarios encontrados';
          this.users = [];
          this.pages = [];
          this.users = data.sort((a, b) => {
            if (
              this.typeUser(a) == 'solicitud' &&
              this.typeUser(b) != 'solicitud'
            )
              return -1;
            else return 1;
          });

          while (this.pages.length < this.users.length / 4) {
            this.pages.push(this.pages.length);
          }
          this.changePageNewMatches(0);
          this.onLoadUsers = false;
        },
        (err) => {
          this.onLoadUsers = false;
          console.log(
            '🚀 ~ file: home.component.ts:275 ~ HomeComponent ~ applyFilter ~ err:',
            err
          );
        }
      );
    } else {
      this.messageFilter = 'usuarios encontrados con intereses similares';
      this.readSimilarUsers();
    }
  }

  changePageNewMatches(page: number) {
    this.currentPageNewMatches = page;
    this.showUsersNewMatches = this.users.filter(() => true);
    this.showUsersNewMatches = this.showUsersNewMatches.splice(page * 20, 20);
    this.scrollToTop();
  }

  changeOrder(order: string) {
    this.orderBy = order;
  }
  onChangeEvent(e: any) {
    if (e.type == 'matchRequest') {
      this.store.dispatch(myRequestMatches.set(e.user));
    } else if (e.type == 'deleteRequest') {
      this.store.dispatch(myRequestMatches.delete(e.user));
    }

    this.readSimilarUsers();
  }
  canNextPageNewMatches(): Boolean {
    const items = this.users.filter(() => true);

    const page = this.currentPageNewMatches + 1;
    return items.splice(page * 20, 20).length == 0;
  }
  onCondadoChange() {
    this.ciudades = this.ciudades.filter((c) => true);
    this.filtersGroup.get('ciudad')?.setValue(null);
  }
  async search() {
    const condado = this.filtersGroup.get('condado')?.value;
    const ciudad = this.filtersGroup.get('ciudad')?.value;
    const idiomas =
      this.filtersGroup.get('idiomas')?.value?.length == 0
        ? null
        : this.filtersGroup.get('idiomas')?.value;
    const experiencia =
      this.filtersGroup.get('experiencia')?.value?.length == 0
        ? null
        : this.filtersGroup.get('experiencia')?.value;
    const conexiones =
      this.filtersGroup.get('conexiones')?.value?.length == 0
        ? null
        : this.filtersGroup.get('conexiones')?.value;

    const res = await this.userSrvc.searchUsersbyparameters({
      condado,
      ciudad,
      idiomas,
      experiencia,
      conexiones,
      batchsize: 400,
    });

    res.subscribe(
      (data: any) => {
        this.users = data.sort((a, b) => {
          if (
            this.typeUser(a) == 'solicitud' &&
            this.typeUser(b) != 'solicitud'
          )
            return -1;
          else return 1;
        });
        this.changePageNewMatches(0);
      },
      (err) => {
        console.log(
          '🚀 ~ file: home.component.ts:351 ~ HomeComponent ~ search ~ err:',
          err
        );
      }
    );
  }
  async clean() {
    await this.readSimilarUsers();

    this.filtersGroup.reset();
    $('select#ciudad').val('Todos').trigger('change');
    $('select#condado').val('').trigger('change');
    $('select#idiomas').val('').trigger('change');
    $('select#experiencia').val('').trigger('change');
    $('select#conexiones').val('').trigger('change');
  }

  typeUser(user: Usuario): ETypePerfil {
    if (this.solicitudesDeMatch.find((s) => s.id == user.id)) {
      return 'solicitud';
    } else if (this.peticionesDeMatch.find((s) => s.id == user.id)) {
      return 'solicitante';
    } else if (this.contactos.find((s) => s.id == user.id)) {
      return 'contacto';
    } else {
      return 'desconocido';
    }
  }
  onEnterPress(e: any) {
    if (e.keyCode == 13 && !e.shiftKey) {
      this.applyFilter();
    }
  }
  async sendContacts() {
    const contactos: any[] = [];
    contactos.push(this.contactoForm.value);
    if (contactos.length > 0) {
      const data = { contactos, user: this.currentUser.nombre };
      const res = await this.mailSrvc.sendInvitation(data);
      res.subscribe(
        (data: any) => {
          Swal.fire(
            'Invitación exitosa',
            '¡Hemos invitado a tus contactos a formar parte de nuestra comunidad! Tu participación es valiosa y contribuye al crecimiento de nuestra red de contactos. Cuantos más amigos invites, más oportunidades de networking tendrás.',
            'success'
          );
          this.contactoForm.reset();
          $('#modalCloser').click();
        },
        (err) => {
          Swal.fire('error', err.error, 'error');
          console.warn(err);
        }
      );
    }
  }
  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
