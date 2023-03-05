import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseUsageComponent } from './license.component';

describe('LicenseUsageComponent', () => {
  let component: LicenseUsageComponent;
  let fixture: ComponentFixture<LicenseUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
