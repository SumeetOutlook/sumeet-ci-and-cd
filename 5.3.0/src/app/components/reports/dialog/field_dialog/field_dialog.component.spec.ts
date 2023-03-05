import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultFieldsComponent } from './field_dialog.component';

describe('DefaultFieldsComponent', () => {
  let component: DefaultFieldsComponent;
  let fixture: ComponentFixture<DefaultFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
