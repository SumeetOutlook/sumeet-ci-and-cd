import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendForReconciliationComponent } from './send_for_reconciliation.component';

describe('SendForReconciliationComponent', () => {
  let component: SendForReconciliationComponent;
  let fixture: ComponentFixture<SendForReconciliationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendForReconciliationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendForReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
