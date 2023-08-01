import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ETypePerfil, Usuario } from 'src/app/tools/models';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  @Input() user!: Usuario;
  @Input() canEdit: boolean = false;
  @Input() typeProfile: ETypePerfil | undefined = 'desconocido';

  @Output() isOnEdit = new EventEmitter<boolean>();

  onEdit() {
    this.isOnEdit.emit(true);
  }
}
