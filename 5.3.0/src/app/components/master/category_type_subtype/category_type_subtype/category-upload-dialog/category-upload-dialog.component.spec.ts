import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryUploadDialogComponent } from './category-upload-dialog.component';

describe('CategoryUploadDialogComponent', () => {
  let component: CategoryUploadDialogComponent;
  let fixture: ComponentFixture<CategoryUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryUploadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
