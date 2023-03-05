import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtypeDialogComponent } from './subtype_add_edit_dialog.component';

describe('SubtypeDialogComponent', () => {
  let component: SubtypeDialogComponent;
  let fixture: ComponentFixture<SubtypeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtypeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
