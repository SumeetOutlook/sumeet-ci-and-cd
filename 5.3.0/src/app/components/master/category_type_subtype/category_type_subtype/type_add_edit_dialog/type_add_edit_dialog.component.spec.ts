import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeDialogComponent } from './type_add_edit_dialog.component';

describe('TypeDialogComponent', () => {
  let component: TypeDialogComponent;
  let fixture: ComponentFixture<TypeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
