import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransitAssetsComponent } from './view_transit_assets.component';

describe('PhysicalMovementComponent', () => {
  let component: ViewTransitAssetsComponent;
  let fixture: ComponentFixture<ViewTransitAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTransitAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTransitAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
