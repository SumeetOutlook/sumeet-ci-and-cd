import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLicenseDialogComponent } from './edit-license-dialog.component';

describe('AddLicenseDialogComponent', () => {
  let component: EditLicenseDialogComponent;
  let fixture: ComponentFixture<EditLicenseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLicenseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLicenseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
