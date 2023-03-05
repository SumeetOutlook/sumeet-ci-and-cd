import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseUtilizationComponent } from './license-utilization.component';

describe('LicenseUtilizationComponent', () => {
  let component: LicenseUtilizationComponent;
  let fixture: ComponentFixture<LicenseUtilizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseUtilizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
