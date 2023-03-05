import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetRetirementReportComponent } from './asset-retirement-report.component';

describe('AssetRetirementReportComponent', () => {
  let component: AssetRetirementReportComponent;
  let fixture: ComponentFixture<AssetRetirementReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetRetirementReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetRetirementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
