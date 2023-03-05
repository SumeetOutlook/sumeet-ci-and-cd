import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueWiseReportComponent } from './issue-wise-report.component';

describe('IssueWiseReportComponent', () => {
  let component: IssueWiseReportComponent;
  let fixture: ComponentFixture<IssueWiseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueWiseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
