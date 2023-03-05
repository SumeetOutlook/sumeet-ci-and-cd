import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransferListComponent } from './asset-transfer-list.component';

describe('AssetTransferListComponent', () => {
  let component: AssetTransferListComponent;
  let fixture: ComponentFixture<AssetTransferListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTransferListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
