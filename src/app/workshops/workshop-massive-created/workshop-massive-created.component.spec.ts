import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopMassiveCreatedComponent } from './workshop-massive-created.component';

describe('WorkshopMassiveCreatedComponent', () => {
  let component: WorkshopMassiveCreatedComponent;
  let fixture: ComponentFixture<WorkshopMassiveCreatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopMassiveCreatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopMassiveCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
