import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapEditHardwareAssetComponent } from './map-edit-hardware-asset.component';

describe('MapEditHardwareAssetComponent', () => {
  let component: MapEditHardwareAssetComponent;
  let fixture: ComponentFixture<MapEditHardwareAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapEditHardwareAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapEditHardwareAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
