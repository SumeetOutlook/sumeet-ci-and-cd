import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageorNotinUsedComponent } from './damageor-notin-used.component';

describe('DamageorNotinUsedComponent', () => {
  let component: DamageorNotinUsedComponent;
  let fixture: ComponentFixture<DamageorNotinUsedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageorNotinUsedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageorNotinUsedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
