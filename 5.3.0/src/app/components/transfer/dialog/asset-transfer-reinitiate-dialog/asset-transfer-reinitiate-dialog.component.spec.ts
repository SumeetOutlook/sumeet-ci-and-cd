import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransferReinitiateDialogComponent } from './asset-transfer-reinitiate-dialog.component';

describe('AssetTransferReinitiateDialogComponent', () => {
  let component: AssetTransferReinitiateDialogComponent;
  let fixture: ComponentFixture<AssetTransferReinitiateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTransferReinitiateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTransferReinitiateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
