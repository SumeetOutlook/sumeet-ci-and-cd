import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareDiscoveryReportComponent } from './hardware-discovery-report.component';

describe('HardwareDiscoveryReportComponent', () => {
  let component: HardwareDiscoveryReportComponent;
  let fixture: ComponentFixture<HardwareDiscoveryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareDiscoveryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareDiscoveryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
