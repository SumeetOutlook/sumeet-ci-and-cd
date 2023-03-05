import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetirementApprovalDialogComponent } from './retirement-approval-dialog.component';

describe('RetirementApprovalDialogComponent', () => {
  let component: RetirementApprovalDialogComponent;
  let fixture: ComponentFixture<RetirementApprovalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetirementApprovalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetirementApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
