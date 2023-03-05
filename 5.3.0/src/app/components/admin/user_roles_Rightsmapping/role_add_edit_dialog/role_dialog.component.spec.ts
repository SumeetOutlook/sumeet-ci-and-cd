import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Role_dialogComponent } from './role_dialog.component';

describe('Role_dialogComponent', () => {
  let component: Role_dialogComponent;
  let fixture: ComponentFixture<Role_dialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Role_dialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Role_dialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
