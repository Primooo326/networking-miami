import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Auth0Component } from './auth0.component';

describe('Auth0Component', () => {
  let component: Auth0Component;
  let fixture: ComponentFixture<Auth0Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Auth0Component]
    });
    fixture = TestBed.createComponent(Auth0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
