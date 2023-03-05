import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewModifiedAssetsComponent } from './view-modified-assets.component';

describe('ViewModifiedAssetsComponent', () => {
  let component: ViewModifiedAssetsComponent;
  let fixture: ComponentFixture<ViewModifiedAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewModifiedAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewModifiedAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
