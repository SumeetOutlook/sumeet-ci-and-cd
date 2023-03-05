import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDispatchedReportComponent } from './asset-dispatched-report.component';

describe('AssetDispatchedReportComponent', () => {
  let component: AssetDispatchedReportComponent;
  let fixture: ComponentFixture<AssetDispatchedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetDispatchedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDispatchedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
