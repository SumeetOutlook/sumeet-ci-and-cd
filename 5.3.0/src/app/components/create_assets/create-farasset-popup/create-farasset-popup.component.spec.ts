import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFARAssetPopupComponent } from './create-farasset-popup.component';

describe('CreateFARAssetPopupComponent', () => {
  let component: CreateFARAssetPopupComponent;
  let fixture: ComponentFixture<CreateFARAssetPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFARAssetPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFARAssetPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
