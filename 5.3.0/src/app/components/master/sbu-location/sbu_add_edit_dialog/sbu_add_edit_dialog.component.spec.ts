import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbuAddEditDialogComponent } from './sbu_add_edit_dialog.component';

describe('SbuAddEditDialogComponent', () => {
  let component: SbuAddEditDialogComponent;
  let fixture: ComponentFixture<SbuAddEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbuAddEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbuAddEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
