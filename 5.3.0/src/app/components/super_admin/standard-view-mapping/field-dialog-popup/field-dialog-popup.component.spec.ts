import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldDialogPopupComponent } from './field-dialog-popup.component';

describe('FieldDialogPopupComponent', () => {
  let component: FieldDialogPopupComponent;
  let fixture: ComponentFixture<FieldDialogPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldDialogPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldDialogPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
