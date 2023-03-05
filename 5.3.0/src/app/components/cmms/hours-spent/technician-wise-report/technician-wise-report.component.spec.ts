import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianWiseReportComponent } from './technician-wise-report.component';

describe('TechnicianWiseReportComponent', () => {
  let component: TechnicianWiseReportComponent;
  let fixture: ComponentFixture<TechnicianWiseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicianWiseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicianWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
