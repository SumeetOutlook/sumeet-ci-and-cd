import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadScannedSoftwareComponent } from './upload-scanned-software.component';

describe('UploadScannedSoftwareComponent', () => {
  let component: UploadScannedSoftwareComponent;
  let fixture: ComponentFixture<UploadScannedSoftwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadScannedSoftwareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadScannedSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
