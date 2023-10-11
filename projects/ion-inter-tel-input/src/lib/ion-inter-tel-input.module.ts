import { NgModule } from '@angular/core';
import { IonInterTelInputComponent } from './ion-inter-tel-input.component';
import { CountryPlaceholder } from './pipes/country-placeholder';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonInterTelInputValidators, IonInterTelInputValidatorDirective } from './ion-inter-tel-input.directive';
import { IonInterTelInputService } from './ion-inter-tel-input.service';
import { IonicSelectableComponent } from 'ionic-selectable';

@NgModule({
  declarations: [
    CountryPlaceholder,
    IonInterTelInputValidatorDirective,
    IonInterTelInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableComponent,
  ],
  exports: [
    IonInterTelInputComponent,
    IonInterTelInputValidatorDirective
  ],
  providers: [
    IonInterTelInputService
  ],
})
export class IonInterTelInputModule { }
