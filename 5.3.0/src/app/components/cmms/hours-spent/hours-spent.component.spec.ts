import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursSpentComponent } from './hours-spent.component';

describe('HoursSpentComponent', () => {
  let component: HoursSpentComponent;
  let fixture: ComponentFixture<HoursSpentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoursSpentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoursSpentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
