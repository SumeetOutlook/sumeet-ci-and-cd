import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransferDialogComponent } from './asset-transfer-dialog.component';

describe('AssetTransferDialogComponent', () => {
  let component: AssetTransferDialogComponent;
  let fixture: ComponentFixture<AssetTransferDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTransferDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTransferDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
