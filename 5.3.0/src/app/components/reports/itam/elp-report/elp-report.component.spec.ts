import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElpReportComponent } from './elp-report.component';

describe('ElpReportComponent', () => {
  let component: ElpReportComponent;
  let fixture: ComponentFixture<ElpReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElpReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElpReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
