import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransferVendorDialogComponent } from './asset-transfer-vendor-dialog.component';

describe('AssetTransferVendorDialogComponent', () => {
  let component: AssetTransferVendorDialogComponent;
  let fixture: ComponentFixture<AssetTransferVendorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTransferVendorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTransferVendorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
