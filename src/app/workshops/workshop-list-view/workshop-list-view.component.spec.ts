import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopListViewComponent } from './workshop-list-view.component';

describe('WorkshopListViewComponent', () => {
  let component: WorkshopListViewComponent;
  let fixture: ComponentFixture<WorkshopListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
