import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesEngineListComponent } from './rules-engine-list.component';

describe('RulesEngineListComponent', () => {
  let component: RulesEngineListComponent;
  let fixture: ComponentFixture<RulesEngineListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesEngineListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesEngineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
