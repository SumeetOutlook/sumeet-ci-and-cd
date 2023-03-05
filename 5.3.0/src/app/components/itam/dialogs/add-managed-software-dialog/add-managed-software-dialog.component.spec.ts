import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManagedSoftwareDialogComponent } from './add-managed-software-dialog.component';

describe('AddManagedSoftwareDialogComponent', () => {
  let component: AddManagedSoftwareDialogComponent;
  let fixture: ComponentFixture<AddManagedSoftwareDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddManagedSoftwareDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddManagedSoftwareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
