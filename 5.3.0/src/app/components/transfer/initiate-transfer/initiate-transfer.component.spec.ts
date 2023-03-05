import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateTransferComponent } from './initiate-transfer.component';

describe('InitiateTransferComponent', () => {
  let component: InitiateTransferComponent;
  let fixture: ComponentFixture<InitiateTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiateTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiateTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
