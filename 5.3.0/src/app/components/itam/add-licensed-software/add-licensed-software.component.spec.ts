import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLicensedSoftwareComponent } from './add-licensed-software.component';

describe('AddLicensedSoftwareComponent', () => {
  let component: AddLicensedSoftwareComponent;
  let fixture: ComponentFixture<AddLicensedSoftwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLicensedSoftwareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLicensedSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
