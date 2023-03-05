import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssetPopupComponent } from './createasset_popup.component';

describe('CreateAssetPopupComponent', () => {
  let component: CreateAssetPopupComponent;
  let fixture: ComponentFixture<CreateAssetPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAssetPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAssetPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
