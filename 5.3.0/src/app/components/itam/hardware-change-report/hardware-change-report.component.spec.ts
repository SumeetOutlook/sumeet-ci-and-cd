import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareChangeReportComponent } from './hardware-change-report.component';

describe('HardwareChangeReportComponent', () => {
  let component: HardwareChangeReportComponent;
  let fixture: ComponentFixture<HardwareChangeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareChangeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareChangeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
