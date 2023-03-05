import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetirementApprovalComponent } from './retirement-approval.component';

describe('RetirementApprovalComponent', () => {
  let component: RetirementApprovalComponent;
  let fixture: ComponentFixture<RetirementApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetirementApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetirementApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
