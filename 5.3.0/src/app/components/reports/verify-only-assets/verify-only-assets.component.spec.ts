import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyOnlyAssetsComponent } from './verify-only-assets.component';

describe('VerifyOnlyAssetsComponent', () => {
  let component: VerifyOnlyAssetsComponent;
  let fixture: ComponentFixture<VerifyOnlyAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyOnlyAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyOnlyAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
