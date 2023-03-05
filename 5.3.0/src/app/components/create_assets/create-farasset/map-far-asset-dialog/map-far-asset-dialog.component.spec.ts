import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapFarAssetDialogComponent } from './map-far-asset-dialog.component';

describe('MapFarAssetDialogComponent', () => {
  let component: MapFarAssetDialogComponent;
  let fixture: ComponentFixture<MapFarAssetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapFarAssetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapFarAssetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
