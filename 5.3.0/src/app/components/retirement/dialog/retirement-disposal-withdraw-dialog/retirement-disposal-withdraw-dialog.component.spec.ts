import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetirementDisposalWithdrawDialogComponent } from './retirement-disposal-withdraw-dialog.component';

describe('RetirementDisposalWithdrawDialogComponent', () => {
  let component: RetirementDisposalWithdrawDialogComponent;
  let fixture: ComponentFixture<RetirementDisposalWithdrawDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetirementDisposalWithdrawDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetirementDisposalWithdrawDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
