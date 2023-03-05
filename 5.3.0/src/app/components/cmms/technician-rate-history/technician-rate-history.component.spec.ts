import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianRateHistoryComponent } from './technician-rate-history.component';

describe('TechnicianRateHistoryComponent', () => {
  let component: TechnicianRateHistoryComponent;
  let fixture: ComponentFixture<TechnicianRateHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicianRateHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicianRateHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
