import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUploadDocumentsDialogComponent } from './view-upload-documents-dialog.component';

describe('ViewUploadDocumentsDialogComponent', () => {
  let component: ViewUploadDocumentsDialogComponent;
  let fixture: ComponentFixture<ViewUploadDocumentsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUploadDocumentsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUploadDocumentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
