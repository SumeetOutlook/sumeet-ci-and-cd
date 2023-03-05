import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveAssetDialogComponent } from './receive-asset-dialog.component';

describe('ReceiveAssetDialogComponent', () => {
  let component: ReceiveAssetDialogComponent;
  let fixture: ComponentFixture<ReceiveAssetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveAssetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveAssetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
