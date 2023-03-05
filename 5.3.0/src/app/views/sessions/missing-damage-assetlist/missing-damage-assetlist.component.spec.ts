import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingDamageAssetlistComponent } from './missing-damage-assetlist.component';

describe('MissingDamageAssetlistComponent', () => {
  let component: MissingDamageAssetlistComponent;
  let fixture: ComponentFixture<MissingDamageAssetlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingDamageAssetlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingDamageAssetlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
