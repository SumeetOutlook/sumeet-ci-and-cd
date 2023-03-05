import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentSpiltDialogComponent } from './component-spilt-dialog.component';

describe('ComponentSpiltDialogComponent', () => {
  let component: ComponentSpiltDialogComponent;
  let fixture: ComponentFixture<ComponentSpiltDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentSpiltDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentSpiltDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
