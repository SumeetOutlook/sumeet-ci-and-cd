import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateRetirementComponent } from './initiate-retirement.component';

describe('InitiateRetirementComponent', () => {
  let component: InitiateRetirementComponent;
  let fixture: ComponentFixture<InitiateRetirementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiateRetirementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiateRetirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
