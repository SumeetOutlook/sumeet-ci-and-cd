import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScannedSoftwareComponent } from './add-scanned-software.component';

describe('AddScannedSoftwareComponent', () => {
  let component: AddScannedSoftwareComponent;
  let fixture: ComponentFixture<AddScannedSoftwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddScannedSoftwareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddScannedSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
