import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopCreateDetailComponent } from './workshop-create-detail.component';

describe('WorkshopCreateDetailComponent', () => {
  let component: WorkshopCreateDetailComponent;
  let fixture: ComponentFixture<WorkshopCreateDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopCreateDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopCreateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
