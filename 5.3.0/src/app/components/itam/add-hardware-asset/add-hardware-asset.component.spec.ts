import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHardwareAssetComponent } from './add-hardware-asset.component';

describe('AddHardwareAssetComponent', () => {
  let component: AddHardwareAssetComponent;
  let fixture: ComponentFixture<AddHardwareAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHardwareAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHardwareAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
