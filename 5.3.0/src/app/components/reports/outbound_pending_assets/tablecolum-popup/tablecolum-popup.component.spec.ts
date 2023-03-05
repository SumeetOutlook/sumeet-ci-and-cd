import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { tablecolumComponent } from './tablecolum-popup.component';

describe('tablecolumComponent', () => {
  let component: tablecolumComponent;
  let fixture: ComponentFixture<tablecolumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ tablecolumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(tablecolumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
