import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssignConfigurationComponent } from './add-assign-configuration.component';

describe('AddAssignConfigurationComponent', () => {
  let component: AddAssignConfigurationComponent;
  let fixture: ComponentFixture<AddAssignConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssignConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssignConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
