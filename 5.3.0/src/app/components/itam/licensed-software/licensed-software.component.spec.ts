import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensedSoftwareComponent } from './licensed-software.component';

describe('LicensedSoftwareComponent', () => {
  let component: LicensedSoftwareComponent;
  let fixture: ComponentFixture<LicensedSoftwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicensedSoftwareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensedSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
