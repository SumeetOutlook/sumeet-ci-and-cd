import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFarAssetDialogComponent } from './upload-far-asset-dialog.component';

describe('UploadFarAssetDialogComponent', () => {
  let component: UploadFarAssetDialogComponent;
  let fixture: ComponentFixture<UploadFarAssetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFarAssetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFarAssetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
