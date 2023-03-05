import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDiscrepencyReport } from './view_discrepency_report.component';

describe('ViewDiscrepencyReport', () => {
  let component: ViewDiscrepencyReport;
  let fixture: ComponentFixture<ViewDiscrepencyReport>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDiscrepencyReport ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDiscrepencyReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
