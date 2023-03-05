import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareLicensesComponent } from './software-licenses.component';

describe('SoftwareLicensesComponent', () => {
  let component: SoftwareLicensesComponent;
  let fixture: ComponentFixture<SoftwareLicensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftwareLicensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareLicensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
