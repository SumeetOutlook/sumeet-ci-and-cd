import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMasterComponent } from './asset_master.component';

describe('SbuComponent', () => {
  let component: AssetMasterComponent;
  let fixture: ComponentFixture<AssetMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
