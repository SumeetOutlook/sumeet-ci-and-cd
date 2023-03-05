import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDuplicateDialogComponent } from './create-duplicate-dialog.component';

describe('CreateDuplicateDialogComponent', () => {
  let component: CreateDuplicateDialogComponent;
  let fixture: ComponentFixture<CreateDuplicateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDuplicateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDuplicateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
