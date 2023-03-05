import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransferApprovalDialogComponent } from './asset-transfer-approval-dialog.component';

describe('AssetTransferApprovalDialogComponent', () => {
  let component: AssetTransferApprovalDialogComponent;
  let fixture: ComponentFixture<AssetTransferApprovalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTransferApprovalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTransferApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
