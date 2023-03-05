import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwarePackageDetailsDialogComponent } from './software-package-details-dialog.component';

describe('SoftwarePackageDetailsDialogComponent', () => {
  let component: SoftwarePackageDetailsDialogComponent;
  let fixture: ComponentFixture<SoftwarePackageDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftwarePackageDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwarePackageDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
