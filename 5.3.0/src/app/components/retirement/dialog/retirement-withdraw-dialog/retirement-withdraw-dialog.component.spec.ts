import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetirementWithdrawDialogComponent } from './retirement-withdraw-dialog.component';

describe('RetirementWithdrawDialogComponent', () => {
  let component: RetirementWithdrawDialogComponent;
  let fixture: ComponentFixture<RetirementWithdrawDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetirementWithdrawDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetirementWithdrawDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
