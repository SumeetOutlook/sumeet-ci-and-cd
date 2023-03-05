import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareInformationReportComponent } from './software-information-report.component';

describe('SoftwareInformationReportComponent', () => {
  let component: SoftwareInformationReportComponent;
  let fixture: ComponentFixture<SoftwareInformationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftwareInformationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareInformationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
