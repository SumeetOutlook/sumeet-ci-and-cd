import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SSOApprovalConfigurationComponent } from './sso-approval-configuration.component';

describe('SSOApprovalConfigurationComponent', () => {
  let component: SSOApprovalConfigurationComponent;
  let fixture: ComponentFixture<SSOApprovalConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SSOApprovalConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SSOApprovalConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
