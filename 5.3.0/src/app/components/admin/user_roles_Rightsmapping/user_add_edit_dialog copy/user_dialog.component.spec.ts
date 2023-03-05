import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { User_dialogComponent } from './user_dialog.component';

describe('User_dialogComponent', () => {
  let component: User_dialogComponent;
  let fixture: ComponentFixture<User_dialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ User_dialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(User_dialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
