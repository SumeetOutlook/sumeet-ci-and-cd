import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransferPhysicalWithdrawDialogComponent } from './asset-transfer-physical-withdraw-dialog.component';

describe('AssetTransferPhysicalWithdrawDialogComponent', () => {
  let component: AssetTransferPhysicalWithdrawDialogComponent;
  let fixture: ComponentFixture<AssetTransferPhysicalWithdrawDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTransferPhysicalWithdrawDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTransferPhysicalWithdrawDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
