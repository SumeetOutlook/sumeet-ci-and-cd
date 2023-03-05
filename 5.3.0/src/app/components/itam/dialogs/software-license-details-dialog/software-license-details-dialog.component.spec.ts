import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareLicenseDetailsDialogComponent } from './software-license-details-dialog.component';

describe('SoftwareLicenseDetailsDialogComponent', () => {
  let component: SoftwareLicenseDetailsDialogComponent;
  let fixture: ComponentFixture<SoftwareLicenseDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftwareLicenseDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareLicenseDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
