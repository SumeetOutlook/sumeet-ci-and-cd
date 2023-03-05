import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovetaggingComponent } from './approvetagging.component';

describe('UserCredentialsComponent', () => {
  let component: ApprovetaggingComponent;
  let fixture: ComponentFixture<ApprovetaggingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovetaggingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovetaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
