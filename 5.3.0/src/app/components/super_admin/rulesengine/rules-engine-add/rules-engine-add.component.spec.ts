import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RulesEngineAddComponent } from './rules-engine-add.component';

describe('RulesEngineAddComponent', () => {
  let component: RulesEngineAddComponent;
  let fixture: ComponentFixture<RulesEngineAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesEngineAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesEngineAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
