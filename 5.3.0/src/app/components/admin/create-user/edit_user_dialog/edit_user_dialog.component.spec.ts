import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { editUserDialogComponent } from './edit_user_dialog.component';

describe('editUserDialogComponent', () => {
  let component: editUserDialogComponent;
  let fixture: ComponentFixture<editUserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ editUserDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(editUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
