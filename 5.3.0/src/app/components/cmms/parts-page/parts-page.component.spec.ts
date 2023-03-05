import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsPageComponent } from './parts-page.component';

describe('PartsPageComponent', () => {
  let component: PartsPageComponent;
  let fixture: ComponentFixture<PartsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
