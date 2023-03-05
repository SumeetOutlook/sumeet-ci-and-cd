import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Filter_DialogComponent } from './filter_dialog.component';

describe('Filter_DialogComponent', () => {
  let component: Filter_DialogComponent;
  let fixture: ComponentFixture<Filter_DialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Filter_DialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Filter_DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
