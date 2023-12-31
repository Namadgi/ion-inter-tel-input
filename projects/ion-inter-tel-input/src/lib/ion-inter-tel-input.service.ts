import { Injectable } from '@angular/core';

import { CountryI } from './models/country.model';
import { countries } from './data/countries';

@Injectable({
  providedIn: 'root'
})
export class IonInterTelInputService {

  countryList: CountryI[] = countries;

  constructor() { }

  getListOfCountries(): any {
    return this.countryList;
  }
}
