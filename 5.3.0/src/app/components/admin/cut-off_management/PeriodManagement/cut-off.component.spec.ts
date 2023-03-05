import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CutOffComponent } from './cut-off.component';

describe('CutOffComponent', () => {
  let component: CutOffComponent;
  let fixture: ComponentFixture<CutOffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CutOffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CutOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
