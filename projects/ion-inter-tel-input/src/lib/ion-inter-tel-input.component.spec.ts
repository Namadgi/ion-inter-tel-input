import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IonInterTelInputComponent } from './ion-inter-tel-input.component';

describe('IonInterTelInputComponent', () => {
  let component: IonInterTelInputComponent;
  let fixture: ComponentFixture<IonInterTelInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IonInterTelInputComponent]
    });
    fixture = TestBed.createComponent(IonInterTelInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
