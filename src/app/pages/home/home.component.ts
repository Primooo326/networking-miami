import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MailService } from 'src/app/services/mail/mail.service';
import { UserService } from 'src/app/services/user/user.service';
import { Usuario } from 'src/app/tools/models';
import Swal from 'sweetalert2';
import * as Masonry from 'masonry-layout';
import { Store } from '@ngrx/store';
import { matchPendingSelect, matchRequestSelect } from 'src/redux/selectors';
import { ETypePerfil } from 'src/app/tools/models';
import { myRequestMatches } from 'src/redux/actions';
import { userSelect } from '../../../redux/selectors';
import Typewriter from 'typewriter-effect/dist/core';
import { frases } from 'src/assets/utilities';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  idiomas = JSON.parse(localStorage.getItem('lenguajes')!);
  experiencia = JSON.parse(localStorage.getItem('experiencia')!);
  intereses = JSON.parse(localStorage.getItem('interes')!);
  condados = JSON.parse(localStorage.getItem('condados')!);
  conexion = JSON.parse(localStorage.getItem('conexion')!);
  conexion2 = [
    {
      searchBy: 'personas que quieran compartir su conocimiento.',
      value: 'Quiero compartir mi conocimiento.',
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
  messajeFilter = 'usuarios encontrados con intereses similares';
  pages: number[] = [];

  solicitudesDeMatch: Usuario[] = [];
  peticionesDeMatch: Usuario[] = [];

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

    this.currentUser.verificado == 0
      ? (this.verificado = false)
      : (this.verificado = true);

    await this.readSimilarUsers();

    $('select.select2').select2({
      dropdownAutoWidth: true,
      width: '100%',
      minimumResultsForSearch: Infinity,
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
        this.ciudades = this.condados[idx].ciudades;
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

    this.initTypewriter();
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
        console.log(data);
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
    this.initMasonry();
  }
  async applyFilter() {
    const filter = this.filterInput.value?.trim();
    if (filter!.length != 0) {
      const res = await this.userSrvc.searchUsers(50, 0, filter!);
      res.subscribe(
        (data: any) => {
          this.messajeFilter = 'usuarios encontrados';
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
          console.log(err);
        }
      );
    } else {
      this.messajeFilter = 'usuarios encontrados con intereses similares';
      this.readSimilarUsers();
    }
  }

  changePageNewMatches(page: number) {
    this.currentPageNewMatches = page;
    this.showUsersNewMatches = this.users.filter(() => true);
    this.showUsersNewMatches = this.showUsersNewMatches.splice(page * 20, 20);
    this.initMasonry();
  }
  initMasonry() {
    setTimeout(() => {
      var grid = document.querySelector('.rowmsry');
      new Masonry(grid!, {
        itemSelector: '.colmsry',
        gutter: 0,
        resize: true,
        initLayout: true,
        transitionDuration: '0.2s',
        stagger: 0,
        percentPosition: true,
        horizontalOrder: true,
        originLeft: true,
        originTop: true,
      });
    }, 10);
  }
  initTypewriter() {
    const phrase = document.getElementById('phrase');

    new Typewriter(phrase, {
      delay: 10,
      strings: frases[Math.floor(Math.random() * frases.length)],
      autoStart: true,
    });
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
        console.log(data);
        this.changePageNewMatches(0);
      },
      (err) => {
        console.log(err);
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
    } else {
      return 'desconocido';
    }
  }
  onEnterPress(e: any) {
    if (e.keyCode == 13 && !e.shiftKey) {
      this.applyFilter();
    }
  }
}
