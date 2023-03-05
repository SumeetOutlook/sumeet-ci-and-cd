import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomViewMappingComponent } from './custom-view-mapping.component';

describe('CustomViewMappingComponent', () => {
  let component: CustomViewMappingComponent;
  let fixture: ComponentFixture<CustomViewMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomViewMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomViewMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
