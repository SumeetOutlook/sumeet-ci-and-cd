import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalRejectPopupComponent } from './additional-reject-popup.component';

describe('AdditionalRejectPopupComponent', () => {
  let component: AdditionalRejectPopupComponent;
  let fixture: ComponentFixture<AdditionalRejectPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalRejectPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalRejectPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
