import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopDeleteComponent } from './workshop-delete.component';

describe('WorkshopDeleteComponent', () => {
  let component: WorkshopDeleteComponent;
  let fixture: ComponentFixture<WorkshopDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
