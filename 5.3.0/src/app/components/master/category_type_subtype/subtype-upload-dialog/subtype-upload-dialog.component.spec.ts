import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtypeUploadDialogComponent } from './subtype-upload-dialog.component';

describe('SubtypeUploadDialogComponent', () => {
  let component: SubtypeUploadDialogComponent;
  let fixture: ComponentFixture<SubtypeUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtypeUploadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtypeUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
