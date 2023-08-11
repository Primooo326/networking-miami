import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatModalComponent } from './chat-modal.component';

describe('ChatModalComponent', () => {
  let component: ChatModalComponent;
  let fixture: ComponentFixture<ChatModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatModalComponent]
    });
    fixture = TestBed.createComponent(ChatModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
