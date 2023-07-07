import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-modal',
  templateUrl: './chat-modal.component.html',
  styleUrls: ['./chat-modal.component.scss']
})
export class ChatModalComponent {

  @Input() user:any
  isShrink = true
  isHidden = true

  constructor() { }


  shrinkChat(){
    this.isShrink = !this.isShrink
  }

  hideChat(){
    this.isHidden = !this.isHidden
  }

}
