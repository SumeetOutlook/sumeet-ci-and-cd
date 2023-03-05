import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMailCategoryownerDialogComponent } from './send-mail-categoryowner-dialog.component';

describe('SendMailCategoryownerDialogComponent', () => {
  let component: SendMailCategoryownerDialogComponent;
  let fixture: ComponentFixture<SendMailCategoryownerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendMailCategoryownerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMailCategoryownerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
