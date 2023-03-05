import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDefault_DialogComponent } from './filter_dialog.component';

describe('FilterDefault_DialogComponent', () => {
  let component: FilterDefault_DialogComponent;
  let fixture: ComponentFixture<FilterDefault_DialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterDefault_DialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDefault_DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
