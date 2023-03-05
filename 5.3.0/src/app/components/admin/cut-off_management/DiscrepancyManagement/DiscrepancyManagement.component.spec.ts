import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscrepancyManagement } from './DiscrepancyManagement.component';

describe('DiscrepancyManagement', () => {
  let component: DiscrepancyManagement;
  let fixture: ComponentFixture<DiscrepancyManagement>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscrepancyManagement ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscrepancyManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
