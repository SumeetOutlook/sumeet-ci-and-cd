import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewfieldComponent } from './viewfield.component';

describe('ViewfieldComponent', () => {
  let component: ViewfieldComponent;
  let fixture: ComponentFixture<ViewfieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewfieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
