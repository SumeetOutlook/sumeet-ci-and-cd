import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import{TagMasterComponent} from './tag_master.component';


describe('CreateUserComponent', () => {
  let component: TagMasterComponent;
  let fixture: ComponentFixture<TagMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
