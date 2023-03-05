import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleRightsMappingComponent } from './user-role-rights.component';

describe('UserRoleRightsMappingComponent', () => {
  let component: UserRoleRightsMappingComponent;
  let fixture: ComponentFixture<UserRoleRightsMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRoleRightsMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleRightsMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
