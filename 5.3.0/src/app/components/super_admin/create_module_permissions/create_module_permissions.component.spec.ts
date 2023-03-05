import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModulePermissionComponent } from './create_module_permissions.component';

describe('CreateModulePermissionComponent', () => {
  let component: CreateModulePermissionComponent;
  let fixture: ComponentFixture<CreateModulePermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateModulePermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateModulePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
