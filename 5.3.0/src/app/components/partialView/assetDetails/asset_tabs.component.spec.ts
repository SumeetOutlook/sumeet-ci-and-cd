import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { assetTabsComponent } from './asset_tabs.component';

describe('assetTabsComponent', () => {
  let component: assetTabsComponent;
  let fixture: ComponentFixture<assetTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ assetTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(assetTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
