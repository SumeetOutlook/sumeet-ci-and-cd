import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTechnicianRateDialogComponent } from './add-edit-technician-rate-dialog.component';

describe('AddEditTechnicianRateDialogComponent', () => {
  let component: AddEditTechnicianRateDialogComponent;
  let fixture: ComponentFixture<AddEditTechnicianRateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditTechnicianRateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditTechnicianRateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
