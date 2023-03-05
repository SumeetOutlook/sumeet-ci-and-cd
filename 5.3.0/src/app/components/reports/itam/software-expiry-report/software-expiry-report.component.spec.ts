import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareExpiryReportComponent } from './software-expiry-report.component';

describe('SoftwareExpiryReportComponent', () => {
  let component: SoftwareExpiryReportComponent;
  let fixture: ComponentFixture<SoftwareExpiryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftwareExpiryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareExpiryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
