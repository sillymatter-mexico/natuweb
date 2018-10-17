import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopAddStaffComponent } from './workshop-add-staff.component';

describe('WorkshopAddStaffComponent', () => {
  let component: WorkshopAddStaffComponent;
  let fixture: ComponentFixture<WorkshopAddStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopAddStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopAddStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
