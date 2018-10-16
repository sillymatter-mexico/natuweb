import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopCheckinComponent } from './workshop-checkin.component';

describe('WorkshopCheckinComponent', () => {
  let component: WorkshopCheckinComponent;
  let fixture: ComponentFixture<WorkshopCheckinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopCheckinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopCheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
