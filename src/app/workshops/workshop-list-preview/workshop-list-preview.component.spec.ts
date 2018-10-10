import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopListPreviewComponent } from './workshop-list-preview.component';

describe('WorkshopListPreviewComponent', () => {
  let component: WorkshopListPreviewComponent;
  let fixture: ComponentFixture<WorkshopListPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopListPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopListPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
