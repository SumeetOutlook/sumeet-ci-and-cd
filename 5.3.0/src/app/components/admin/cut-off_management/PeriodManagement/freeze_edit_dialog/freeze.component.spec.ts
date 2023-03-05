import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreezedialogComponent } from './freeze.component';

describe('Group_dialogComponent', () => {
  let component: FreezedialogComponent;
  let fixture: ComponentFixture<FreezedialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreezedialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreezedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
