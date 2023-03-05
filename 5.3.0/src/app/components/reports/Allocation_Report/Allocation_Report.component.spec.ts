import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationReportComponent } from './Allocation_Report.component';

describe('AllocationReportComponent', () => {
  let component: AllocationReportComponent;
  let fixture: ComponentFixture<AllocationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
