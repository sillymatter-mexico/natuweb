import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopInvitationComponent } from './workshop-invitation.component';

describe('WorkshopInvitationComponent', () => {
  let component: WorkshopInvitationComponent;
  let fixture: ComponentFixture<WorkshopInvitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopInvitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
