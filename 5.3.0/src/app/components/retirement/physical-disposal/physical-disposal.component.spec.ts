import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalDisposalComponent } from './physical-disposal.component';

describe('PhysicalDisposalComponent', () => {
  let component: PhysicalDisposalComponent;
  let fixture: ComponentFixture<PhysicalDisposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalDisposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalDisposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
