import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Group_dialogComponent } from './group_dialog.component';

describe('Group_dialogComponent', () => {
  let component: Group_dialogComponent;
  let fixture: ComponentFixture<Group_dialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Group_dialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Group_dialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
