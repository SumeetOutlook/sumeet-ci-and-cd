import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransferSubmitinformationDialogComponent } from './asset-transfer-submitinformation-dialog.component';

describe('AssetTransferSubmitinformationDialogComponent', () => {
  let component: AssetTransferSubmitinformationDialogComponent;
  let fixture: ComponentFixture<AssetTransferSubmitinformationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTransferSubmitinformationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTransferSubmitinformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
