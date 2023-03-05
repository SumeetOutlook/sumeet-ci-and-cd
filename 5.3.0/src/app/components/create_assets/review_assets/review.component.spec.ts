import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAssetComponent } from './review.component';

describe('ReviewAssetComponent', () => {
  let component: ReviewAssetComponent;
  let fixture: ComponentFixture<ReviewAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
