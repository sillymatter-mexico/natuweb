import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopCreateComponent } from './workshop-create.component';

describe('WorkshopCreateComponent', () => {
  let component: WorkshopCreateComponent;
  let fixture: ComponentFixture<WorkshopCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
