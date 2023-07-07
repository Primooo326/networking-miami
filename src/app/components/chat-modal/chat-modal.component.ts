import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chat-modal',
  templateUrl: './chat-modal.component.html',
  styleUrls: ['./chat-modal.component.scss']
})
export class ChatModalComponent implements OnInit {
  isShrink = true
  isHidden = true


  @Input() user:any

  @Input()
  set valor(value:boolean){
    this.isShrink = false
    this.isHidden = value
  }

  get valor(){
    return this.isHidden
  }

  @Output() valorChange = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.user);
  }


  shrinkChat(){
    this.isShrink = !this.isShrink
  }

  hideChat(){
    this.isHidden = !this.isHidden
    this.valorChange.emit(this.isHidden)
  }

}
