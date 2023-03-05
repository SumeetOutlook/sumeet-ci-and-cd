import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationspanelComponent } from './notificationspanel.component';

describe('NotificationspanelComponent', () => {
  let component: NotificationspanelComponent;
  let fixture: ComponentFixture<NotificationspanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationspanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationspanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
