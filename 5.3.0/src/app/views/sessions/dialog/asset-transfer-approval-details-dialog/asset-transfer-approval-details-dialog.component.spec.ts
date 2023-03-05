import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransferApprovalDetailsDialogComponent } from './asset-transfer-approval-details-dialog.component';

describe('AssetTransferApprovalDetailsDialogComponent', () => {
  let component: AssetTransferApprovalDetailsDialogComponent;
  let fixture: ComponentFixture<AssetTransferApprovalDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTransferApprovalDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTransferApprovalDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
