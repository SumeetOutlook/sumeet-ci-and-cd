import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetirementApprovalDetailsDialogComponent } from './retirement-approval-details-dialog.component';

describe('RetirementApprovalDetailsDialogComponent', () => {
  let component: RetirementApprovalDetailsDialogComponent;
  let fixture: ComponentFixture<RetirementApprovalDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetirementApprovalDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetirementApprovalDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
