import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetRetirementApprovalDetailsDialogComponent } from './asset-retirement-approval-details-dialog.component';

describe('AssetRetirementApprovalDetailsDialogComponent', () => {
  let component: AssetRetirementApprovalDetailsDialogComponent;
  let fixture: ComponentFixture<AssetRetirementApprovalDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetRetirementApprovalDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetRetirementApprovalDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
