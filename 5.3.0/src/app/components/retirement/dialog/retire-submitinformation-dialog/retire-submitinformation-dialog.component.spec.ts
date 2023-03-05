import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetireSubmitinformationDialogComponent } from './retire-submitinformation-dialog.component';

describe('RetireSubmitinformationDialogComponent', () => {
  let component: RetireSubmitinformationDialogComponent;
  let fixture: ComponentFixture<RetireSubmitinformationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetireSubmitinformationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetireSubmitinformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
