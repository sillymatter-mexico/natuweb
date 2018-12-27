import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralModalAlertComponent } from './general-modal-alert.component';

describe('GeneralModalAlertComponent', () => {
  let component: GeneralModalAlertComponent;
  let fixture: ComponentFixture<GeneralModalAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralModalAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralModalAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
