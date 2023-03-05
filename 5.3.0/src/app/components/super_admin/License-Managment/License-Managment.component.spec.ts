import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseManagmentComponent } from './License-Managment.component';

describe('LicenseManagmentComponent', () => {
  let component: LicenseManagmentComponent;
  let fixture: ComponentFixture<LicenseManagmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseManagmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
