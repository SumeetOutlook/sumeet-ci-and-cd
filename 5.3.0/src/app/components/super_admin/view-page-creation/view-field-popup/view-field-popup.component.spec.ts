import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFieldPopupComponent } from './view-field-popup.component';

describe('ViewFieldPopupComponent', () => {
  let component: ViewFieldPopupComponent;
  let fixture: ComponentFixture<ViewFieldPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFieldPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFieldPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
