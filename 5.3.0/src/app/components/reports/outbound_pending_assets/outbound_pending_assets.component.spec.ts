import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Outbound_Pending_AssetsComponent } from './outbound_pending_assets.component';

describe('UserCredentialsComponent', () => {
  let component: Outbound_Pending_AssetsComponent;
  let fixture: ComponentFixture<Outbound_Pending_AssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Outbound_Pending_AssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Outbound_Pending_AssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
