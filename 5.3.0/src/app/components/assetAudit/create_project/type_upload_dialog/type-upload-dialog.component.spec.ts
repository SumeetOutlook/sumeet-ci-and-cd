import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeUploadDialogComponent } from './type-upload-dialog.component';

describe('TypeUploadDialogComponent', () => {
  let component: TypeUploadDialogComponent;
  let fixture: ComponentFixture<TypeUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeUploadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
