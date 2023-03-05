import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertAssetComponent } from './revert-asset.component';

describe('RevertAssetComponent', () => {
  let component: RevertAssetComponent;
  let fixture: ComponentFixture<RevertAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevertAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevertAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
