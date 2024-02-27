import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyPicsPage } from './my-pics.page';

describe('MyPicsPage', () => {
  let component: MyPicsPage;
  let fixture: ComponentFixture<MyPicsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MyPicsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
