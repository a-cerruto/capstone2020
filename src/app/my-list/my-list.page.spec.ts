import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyListPage } from './my-list.page';

describe('MyListPage', () => {
  let component: MyListPage;
  let fixture: ComponentFixture<MyListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
