import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRoleDialogComponent } from './viewrole.component';

describe('ViewRoleDialogComponent', () => {
  let component: ViewRoleDialogComponent;
  let fixture: ComponentFixture<ViewRoleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRoleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
