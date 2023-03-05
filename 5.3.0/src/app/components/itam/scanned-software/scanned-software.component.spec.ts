import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannedSoftwareComponent } from './scanned-software.component';

describe('ScannedSoftwareComponent', () => {
  let component: ScannedSoftwareComponent;
  let fixture: ComponentFixture<ScannedSoftwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScannedSoftwareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScannedSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
