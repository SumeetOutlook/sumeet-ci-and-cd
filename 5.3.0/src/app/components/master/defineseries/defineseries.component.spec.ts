import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import{DefineseriesComponent} from './defineseries.component';


describe('CreateUserComponent', () => {
  let component: DefineseriesComponent;
  let fixture: ComponentFixture<DefineseriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefineseriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineseriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
