import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopFiltersComponent } from './workshop-filters.component';

describe('WorkshopFiltersComponent', () => {
  let component: WorkshopFiltersComponent;
  let fixture: ComponentFixture<WorkshopFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
