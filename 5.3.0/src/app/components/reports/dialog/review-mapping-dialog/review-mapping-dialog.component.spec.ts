import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewMappingDialogComponent } from './review-mapping-dialog.component';

describe('ReviewMappingDialogComponent', () => {
  let component: ReviewMappingDialogComponent;
  let fixture: ComponentFixture<ReviewMappingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewMappingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewMappingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
