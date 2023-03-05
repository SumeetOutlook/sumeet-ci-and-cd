import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalDisposalDialogComponent } from './physical-disposal-dialog.component';

describe('PhysicalDisposalDialogComponent', () => {
  let component: PhysicalDisposalDialogComponent;
  let fixture: ComponentFixture<PhysicalDisposalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalDisposalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalDisposalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
