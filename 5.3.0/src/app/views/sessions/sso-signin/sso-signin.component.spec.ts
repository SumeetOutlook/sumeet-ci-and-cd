import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsoSigninComponent } from './sso-signin.component';

describe('SsoSigninComponent', () => {
  let component: SsoSigninComponent;
  let fixture: ComponentFixture<SsoSigninComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsoSigninComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsoSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
