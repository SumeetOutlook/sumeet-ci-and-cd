import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRegionCompanyComponent } from './grc.component';

describe('GroupRegionCompanyComponent', () => {
  let component: GroupRegionCompanyComponent;
  let fixture: ComponentFixture<GroupRegionCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupRegionCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupRegionCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
