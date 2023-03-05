import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveAssetComponent } from './receive-asset.component';

describe('ReceiveAssetComponent', () => {
  let component: ReceiveAssetComponent;
  let fixture: ComponentFixture<ReceiveAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
