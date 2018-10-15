import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopCreatedComponent } from './workshop-created.component';

describe('WorkshopCreatedComponent', () => {
  let component: WorkshopCreatedComponent;
  let fixture: ComponentFixture<WorkshopCreatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopCreatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
