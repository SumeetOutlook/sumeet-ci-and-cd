import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditIssueDialogComponent } from './add-edit-issue-dialog.component';

describe('AddEditIssueDialogComponent', () => {
  let component: AddEditIssueDialogComponent;
  let fixture: ComponentFixture<AddEditIssueDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditIssueDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditIssueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
