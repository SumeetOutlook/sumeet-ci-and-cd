import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPageCreationComponent } from './view-page-creation.component';

describe('ViewPageCreationComponent', () => {
  let component: ViewPageCreationComponent;
  let fixture: ComponentFixture<ViewPageCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPageCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPageCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
