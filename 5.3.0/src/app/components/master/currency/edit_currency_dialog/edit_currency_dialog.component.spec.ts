import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { editCurrencyDialogComponent } from './edit_currency_dialog.component';

describe('editUserDialogComponent', () => {
  let component: editCurrencyDialogComponent;
  let fixture: ComponentFixture<editCurrencyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ editCurrencyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(editCurrencyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
