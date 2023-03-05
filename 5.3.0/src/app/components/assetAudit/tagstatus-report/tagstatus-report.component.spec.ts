import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagstatusReportComponent } from './tagstatus-report.component';

describe('TagstatusReportComponent', () => {
  let component: TagstatusReportComponent;
  let fixture: ComponentFixture<TagstatusReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagstatusReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagstatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
