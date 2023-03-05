import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransferReportComponent } from './asset-transfer-report.component';

describe('AssetTransferReportComponent', () => {
  let component: AssetTransferReportComponent;
  let fixture: ComponentFixture<AssetTransferReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTransferReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTransferReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
