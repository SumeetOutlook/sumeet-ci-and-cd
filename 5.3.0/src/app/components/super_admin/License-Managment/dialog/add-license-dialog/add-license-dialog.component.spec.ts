import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLicenseDialogComponent } from './add-license-dialog.component';

describe('AddLicenseDialogComponent', () => {
  let component: AddLicenseDialogComponent;
  let fixture: ComponentFixture<AddLicenseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLicenseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLicenseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
