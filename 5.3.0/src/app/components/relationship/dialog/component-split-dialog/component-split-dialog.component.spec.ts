import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentSplitDialogComponent } from './component-split-dialog.component';

describe('ComponentSplitDialogComponent', () => {
  let component: ComponentSplitDialogComponent;
  let fixture: ComponentFixture<ComponentSplitDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentSplitDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentSplitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
