import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderTypeDialogComponent } from './workorder-type-dialog.component';

describe('WorkorderTypeDialogComponent', () => {
  let component: WorkorderTypeDialogComponent;
  let fixture: ComponentFixture<WorkorderTypeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkorderTypeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
