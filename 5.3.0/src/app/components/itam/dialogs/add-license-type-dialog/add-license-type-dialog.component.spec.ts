import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLicenseTypeDialogComponent } from './add-license-type-dialog.component';

describe('AddLicenseTypeDialogComponent', () => {
  let component: AddLicenseTypeDialogComponent;
  let fixture: ComponentFixture<AddLicenseTypeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLicenseTypeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLicenseTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
