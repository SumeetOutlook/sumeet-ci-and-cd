import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { addUserDialogComponent } from './add_user_dialog.component';

describe('addUserDialogComponent', () => {
  let component: addUserDialogComponent;
  let fixture: ComponentFixture<addUserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ addUserDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(addUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
