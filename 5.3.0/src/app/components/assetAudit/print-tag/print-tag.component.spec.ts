import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import{PrintTagComponent} from './prtint-tag.component';


describe('CreateUserComponent', () => {
  let component: PrintTagComponent;
  let fixture: ComponentFixture<PrintTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
