import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalMovementComponent } from './physical_movement.component';

describe('PhysicalMovementComponent', () => {
  let component: PhysicalMovementComponent;
  let fixture: ComponentFixture<PhysicalMovementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalMovementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
