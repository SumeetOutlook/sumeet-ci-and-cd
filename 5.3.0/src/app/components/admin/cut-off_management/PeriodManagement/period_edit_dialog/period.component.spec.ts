import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerioddialogComponent } from './period.component';

describe('PerioddialogComponent', () => {
  let component: PerioddialogComponent;
  let fixture: ComponentFixture<PerioddialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerioddialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerioddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
