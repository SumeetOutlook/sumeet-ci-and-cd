import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkorderDialogComponent } from './create-workorder-dialog.component';

describe('CreateWorkorderDialogComponent', () => {
  let component: CreateWorkorderDialogComponent;
  let fixture: ComponentFixture<CreateWorkorderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWorkorderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkorderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
