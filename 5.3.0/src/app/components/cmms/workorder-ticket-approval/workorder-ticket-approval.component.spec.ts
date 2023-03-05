import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderTicketApprovalComponent } from './workorder-ticket-approval.component';

describe('WorkorderTicketApprovalComponent', () => {
  let component: WorkorderTicketApprovalComponent;
  let fixture: ComponentFixture<WorkorderTicketApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkorderTicketApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderTicketApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
