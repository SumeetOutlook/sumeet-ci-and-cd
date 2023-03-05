import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonVerifyAssetComponent } from './non-verify-asset.component';

describe('NonVerifyAssetComponent', () => {
  let component: NonVerifyAssetComponent;
  let fixture: ComponentFixture<NonVerifyAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonVerifyAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonVerifyAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
