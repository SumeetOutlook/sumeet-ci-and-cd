import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SadminLoginComponent } from './sadmin-login.component';

describe('SadminLoginComponent', () => {
  let component: SadminLoginComponent;
  let fixture: ComponentFixture<SadminLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SadminLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SadminLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
