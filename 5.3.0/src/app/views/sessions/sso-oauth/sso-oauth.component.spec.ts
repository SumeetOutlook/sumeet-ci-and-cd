import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsoOauthComponent } from './sso-oauth.component';

describe('SsoOauthComponent', () => {
  let component: SsoOauthComponent;
  let fixture: ComponentFixture<SsoOauthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsoOauthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsoOauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
