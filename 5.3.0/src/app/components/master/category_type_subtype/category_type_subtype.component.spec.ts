import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTypeSubtypeComponent } from './category_type_subtype.component';

describe('CategoryTypeSubtypeComponent', () => {
  let component: CategoryTypeSubtypeComponent;
  let fixture: ComponentFixture<CategoryTypeSubtypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryTypeSubtypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryTypeSubtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
