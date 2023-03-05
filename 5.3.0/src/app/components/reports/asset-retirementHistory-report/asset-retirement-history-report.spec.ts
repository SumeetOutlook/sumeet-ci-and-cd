import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetRetirementHistoryReportComponent } from './asset-retirement-history-report.component';

describe('AssetRetirementHistoryReportComponent', () => {
  let component: AssetRetirementHistoryReportComponent;
  let fixture: ComponentFixture<AssetRetirementHistoryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetRetirementHistoryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetRetirementHistoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
