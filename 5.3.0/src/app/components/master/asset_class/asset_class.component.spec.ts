import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetClassComponent } from './asset_class.component';

describe('SbuComponent', () => {
  let component: AssetClassComponent;
  let fixture: ComponentFixture<AssetClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
