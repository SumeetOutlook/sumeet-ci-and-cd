import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransferWithdrawDialogComponent } from './asset-transfer-withdraw-dialog.component';

describe('AssetTransferWithdrawDialogComponent', () => {
  let component: AssetTransferWithdrawDialogComponent;
  let fixture: ComponentFixture<AssetTransferWithdrawDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTransferWithdrawDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTransferWithdrawDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
