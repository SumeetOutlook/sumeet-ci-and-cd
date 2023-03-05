import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetFieldsComponent } from './get-fields.component';

describe('GetFieldsComponent', () => {
  let component: GetFieldsComponent;
  let fixture: ComponentFixture<GetFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
