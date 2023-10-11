import {
  Component,
  OnInit,
  Input,
  forwardRef,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  HostBinding,
} from '@angular/core';
import { IonicSelectableComponent } from 'ionic-selectable';

import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  NG_VALIDATORS,
} from '@angular/forms';


import { IonInput, Platform } from '@ionic/angular';

import {
  PhoneNumber,
  PhoneNumberFormat,
  PhoneNumberUtil,
} from 'google-libphonenumber';

import { CountryI } from './models/country.model';
import { IonInterTelInputModel } from './models/ion-inter-tel-input.model';
import { IonInterTelInputService } from './ion-inter-tel-input.service';
import { raf } from './util/util';

@Component({
  selector: 'lib-ion-inter-tel-input',
  templateUrl: './ion-inter-tel-input.component.html',
  styleUrls: ['./ion-inter-tel-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInterTelInputComponent),
      multi: true,
    },
  ],
})

export class IonInterTelInputComponent
  implements ControlValueAccessor, OnInit, OnChanges {
  @HostBinding('class.ion-inter-tel-input')
  cssClass = true;
  @HostBinding('class.ion-inter-tel-input-ios')
  isIos: boolean = false;
  @HostBinding('class.ion-inter-tel-input-md')
  isMD: boolean = false;
  @HostBinding('class.has-focus')
  hasFocus = false;
  @HostBinding('class.ion-inter-tel-input-has-value')
  get hasValueCssClass(): boolean {
    return this.hasValue();
  }
  @HostBinding('class.ion-inter-tel-input-is-enabled')
  @Input('isEnabled')
  get isEnabled(): boolean {
    return !this.disabled;
  }

  /**
   * Iso Code of default selected Country.
   * See more on.
   *
   * @default ''
   * @memberof IonInterTelInputComponent
   */
  @Input()
  defaultCountryiso = '';

  /**
   * Determines whether to use `00` or `+` as dial code prefix.
   * Available attributes are '+' | '00'.
   * See more on.
   *
   * @default +
   * @memberof IonInterTelInputComponent
   */
  @Input()
  dialCodePrefix: '+' | '00' = '+';

  /**
   * Determines whether to select automatic country based on user input.
   * See more on.
   *
   * @default false
   * @memberof IonInterTelInputComponent
   */
  @Input()
  enableAutoCountrySelect = false;

  /**
   * Determines whether an example number will be shown as a placeholder in input.
   * See more on.
   *
   * @default true
   * @memberof IonInterTelInputComponent
   */
  @Input()
  enablePlaceholder = true;

  /**
   * A fallaback placeholder to be used if no example number is found for a country.
   * See more on.
   *
   * @default ''
   * @memberof IonInterTelInputComponent
   */
  @Input()
  fallbackPlaceholder = '';

  /**
   * If a custom placeholder is needed for input.
   * If this property is set it will override `enablePlaceholder` and only this placeholder will be shown.
   * See more on.
   *
   * @default ''
   * @memberof IonInterTelInputComponent
   */
  @Input()
  inputPlaceholder = '';

  /**
   * Maximum Length for input.
   * See more on.
   *
   * @default '15'
   * @memberof IonInterTelInputComponent
   */
  @Input()
  maxLength = '15';

  /**
   * Title of modal opened to select country dial code.
   * See more on.
   *
   * @default 'Select Country'
   * @memberof IonInterTelInputComponent
   */
  @Input()
  modalTitle = 'Select Country';

  /**
   * CSS class to attach to dial code selectionmodal.
   * See more on.
   *
   * @default ''
   * @memberof IonInterTelInputComponent
   */
  @Input()
  modalCssClass = '';

  /**
   * Placeholder for input in dial code selection modal.
   * See more on.
   *
   * @default 'Enter country name'
   * @memberof IonInterTelInputComponent
   */
  @Input()
  modalSearchPlaceholder = 'Enter country name';

  /**
   * Text for close button in dial code selection modal.
   * See more on.
   *
   * @default 'Close'
   * @memberof IonInterTelInputComponent
   */
  @Input()
  modalCloseText = 'Close';

  /**
   * Slot for close button in dial code selection modal. [Ionic slots](https://ionicframework.com/docs/api/item) are supported
   * See more on.
   *
   * @default 'end'
   * @memberof IonInterTelInputComponent
   */
  @Input()
  modalCloseButtonSlot: 'start' | 'end' | 'primary' | 'secondary' = 'end';

  /**
   * Determines whether dial code selection modal should be searchable or not.
   * See more on.
   *
   * @default 'true'
   * @memberof IonInterTelInputComponent
   */
  @Input()
  modalCanSearch = true;

  /**
   * Determines whether dial code selection modal is closed on backdrop click.
   * See more on.
   *
   * @default 'true'
   * @memberof IonInterTelInputComponent
   */
  @Input()
  modalShouldBackdropClose = true;

  /**
   * Determines whether input should be focused when dial code selection modal is opened.
   * See more on.
   *
   * @default 'true'
   * @memberof IonInterTelInputComponent
   */
  @Input()
  modalShouldFocusSearchbar = true;

  /**
   * Message to show when no countries are found for search in dial code selection modal.
   * See more on.
   *
   * @default 'true'
   * @memberof IonInterTelInputComponent
   */
  @Input()
  modalSearchFailText = 'No countries found';

  /**
   * List of iso codes of manually selected countries as string, which will appear in the dropdown.
   * **Note**: `onlyCountries` should be a string array of country iso codes.
   * See more on.
   *
   * @default null
   * @memberof IonInterTelInputComponent
   */
  @Input()
  onlyCountries: Array<string> = [];

  /**
   * List of iso codesn as string of  countries, which will appear at the top in dial code selection modal.
   * **Note**: `preferredCountries` should be a string array of country iso codes.
   * See more on.
   *
   * @default null
   * @memberof IonInterTelInputComponent
   */
  @Input()
  preferredCountries: Array<string> = [];

  /**
   * Determines whether first country should be selected in dial code select or not.
   * See more on.
   *
   * @default true
   * @memberof IonInterTelInputComponent
   */
  @Input()
  selectFirstCountry = true;

  /**
   * Determines whether to visually separate dialcode into the drop down element.
   * See more on.
   *
   * @default true
   * @memberof IonInterTelInputComponent
   */
  @Input()
  separateDialCode = true;

  /**
   * Fires when the Phone number Input is changed.
   * See more on.
   *
   * @memberof IonInterTelInputComponent
   */
  @Output()
  readonly numberChange = new EventEmitter<Event>();

  /**
   * Fires when the Phone number Input is blurred.
   * See more on.
   *
   * @memberof IonInterTelInputComponent
   */
  @Output()
  readonly numberBlur = new EventEmitter<void>();

  /**
   * Fires when the Phone number Input is focused.
   * See more on.
   *
   * @memberof IonInterTelInputComponent
   */
  @Output()
  readonly numberFocus = new EventEmitter<void>();

  /**
   * Fires when the user is typing in Phone number Input.
   * See more on.
   *
   * @memberof IonInterTelInputComponent
   */
  @Output()
  readonly numberInput = new EventEmitter<KeyboardEvent>();

  /**
   * Fires when the dial code selection is changed.
   * See more on.
   *
   * @memberof IonInterTelInputComponent
   */
  @Output()
  readonly codeChange = new EventEmitter<any>();

  /**
   * Fires when the dial code selection modal is opened.
   * See more on.
   *
   * @memberof IonInterTelInputComponent
   */
  @Output()
  readonly codeOpen = new EventEmitter<any>();

  /**
   * Fires when the dial code selection modal is closed.
   * See more on.
   *
   * @memberof IonInterTelInputComponent
   */
  @Output()
  readonly codeClose = new EventEmitter<any>();

  /**
   * Fires when a dial code is selected in dial code selection modal.
   * See more on.
   *
   * @memberof IonInterTelInputComponent
   */
  @Output()
  readonly codeSelect = new EventEmitter<any>();

  @ViewChild('numberInput', { static: false }) numberInputEl: IonInput | undefined;

  // tslint:disable-next-line: variable-name
  private _value: IonInterTelInputModel | undefined;

  country: CountryI | undefined;
  phoneNumber = '';
  countries: CountryI[] = [];
  disabled = false;
  phoneUtil: any = PhoneNumberUtil.getInstance();

  onTouched: () => void = () => {};
  propagateChange = (_: IonInterTelInputModel | null) => {};

  constructor(
    private el: ElementRef,
    private platform: Platform,
    private IonInterTelInputService: IonInterTelInputService
  ) {}

  get value(): any {
    return this._value || "";
  }

  set value(value: any) {
    this._value = value;
    this.setIonicClasses(this.el);
  }

  emitValueChange(change: IonInterTelInputModel | null) {
    this.propagateChange(change);
  }

  ngOnInit() {
    this.isIos = this.platform.is('ios');
    this.isMD = !this.isIos;
    this.setItemClass(this.el, 'item-interactive', true);

    this.fetchAllCountries();
    this.setPreferredCountries();

    if (this.onlyCountries.length) {
      this.countries = this.countries.filter((country: CountryI) =>
        this.onlyCountries.includes(country.isoCode)
      );
    }

    if (this.selectFirstCountry) {
      if (this.defaultCountryiso) {
        this.setCountry(this.getCountryByIsoCode(this.defaultCountryiso));
      } else {
        if (
          this.preferredCountries.length &&
          this.preferredCountries.includes(this.defaultCountryiso)
        ) {
          this.setCountry(this.getCountryByIsoCode(this.preferredCountries[0]));
        } else {
          this.setCountry(this.countries[0]);
        }
      }
    }
  }

  ngOnChanges(changes: any) {
    if (
      this.countries &&
      changes?.defaulyCountryisoCode &&
      changes.defaulyCountryisoCode.currentValue !==
        changes.defaulyCountryisoCode.previousValue
    ) {
      this.setCountry(changes.defaulyCountryisoCode.currentValue);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: IonInterTelInputModel): void {
    this.fillValues(obj);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  fillValues(value: IonInterTelInputModel) {
    if (
      value &&
      value !== null &&
      typeof value === 'object' &&
      !this.isNullOrWhiteSpace(value)
    ) {
      this.phoneNumber = value.nationalNumber;
      this.setCountry(this.getCountryByIsoCode(value.isoCode));
      this.value = value;
    } else if (
      this.value &&
      this.value !== null &&
      typeof this.value === 'object' &&
      !this.isNullOrWhiteSpace(this.value)
    ) {
      this.phoneNumber = this.value.nationalNumber;
      this.setCountry(this.getCountryByIsoCode(this.value.isoCode));
    }
    setTimeout(() => {
      this.onNumberChange();
    }, 1);
  }

  hasValue(): boolean {
    return !this.isNullOrWhiteSpace(this.value);
  }

  onCodeOpen() {
    this.codeOpen.emit();
  }

  onCodeChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }): void {
    if (this.isNullOrWhiteSpace(this.phoneNumber)) {
      this.emitValueChange(null);
    } else {
      let googleNumber: any;
      try {
        googleNumber = this.phoneUtil.parse(
          this.phoneNumber,
          this.country?.isoCode.toUpperCase()
        );
      } catch (e) {}

      const internationallNo = googleNumber
        ? this.phoneUtil.format(googleNumber, PhoneNumberFormat.INTERNATIONAL)
        : '';
      const nationalNo = googleNumber
        ? this.phoneUtil.format(googleNumber, PhoneNumberFormat.NATIONAL)
        : '';

      if (this.separateDialCode && internationallNo) {
        this.phoneNumber = this.removeDialCode(internationallNo);
      }

      this.emitValueChange({
        internationalNumber: internationallNo,
        nationalNumber: nationalNo,
        isoCode: this.country?.isoCode || "",
        dialCode: this.dialCodePrefix + this.country?.dialCode,
      });
      this.codeChange.emit();
    }
    setTimeout(() => {
      this.numberInputEl?.setFocus();
    }, 400);
  }

  onCodeClose() {
    this.onTouched();
    this.setIonicClasses(this.el);
    this.hasFocus = false;
    this.setItemClass(this.el, 'item-has-focus', false);
    this.codeClose.emit();
  }

  public onCodeSearchCountries(event: {
    component: IonicSelectableComponent;
    text: string;
  }): void {
    const text = event.text.trim().toLowerCase();
    event.component.startSearch();

    event.component.items = this.filterCountries(text);
    event.component.endSearch();
  }

  onCodeSelect() {
    this.codeSelect.emit();
  }

  onIonNumberChange(event: Event) {
    this.setIonicClasses(this.el);
    this.numberChange.emit(event);
  }

  onIonNumberBlur() {
    this.onTouched();
    this.setIonicClasses(this.el);
    this.hasFocus = false;
    this.setItemClass(this.el, 'item-has-focus', false);
    this.numberBlur.emit();
  }

  onIonNumberFocus() {
    this.hasFocus = true;
    this.setItemClass(this.el, 'item-has-focus', true);
    this.numberFocus.emit();
  }

  onIonNumberInput(event: Event) {
    this.numberInput.emit(event as KeyboardEvent);
  }

  onNumberChange(): void {
    if (!this.phoneNumber) {
      this.value = null;
      this.emitValueChange(null);
      return;
    }
    if (this.country) {
      this.emitValueChange({
        internationalNumber:
          this.dialCodePrefix + this.country.dialCode + ' ' + this.phoneNumber,
        nationalNumber: this.phoneNumber,
        isoCode: this.country.isoCode,
        dialCode: this.dialCodePrefix + this.country.dialCode,
      });
    }
    let googleNumber: any;
    try {
      googleNumber = this.phoneUtil.parse(
        this.phoneNumber,
        this.country?.isoCode.toUpperCase()
      );
    } catch (e) {
      return;
    }

    let isoCode: any = this.country ? this.country.isoCode : null;
    // auto select country based on the extension (and areaCode if needed) (e.g select Canada if number starts with +1 416)
    if (this.enableAutoCountrySelect) {
      isoCode =
        googleNumber && googleNumber.getCountryCode()
          ? this.getCountryIsoCode(googleNumber.getCountryCode(), googleNumber)
          : this.country?.isoCode;
      if (isoCode && isoCode !== this.country?.isoCode) {
        const newCountry = this.countries.find(
          (country: CountryI) => country.isoCode === isoCode
        );
        if (newCountry) {
          this.country = newCountry;
        }
      }
    }
    isoCode = isoCode ? isoCode : this.country ? this.country.isoCode : null;

    if (!this.phoneNumber || !isoCode) {
      this.emitValueChange(null);
    } else {
      const internationallNo = googleNumber
        ? this.phoneUtil.format(googleNumber, PhoneNumberFormat.INTERNATIONAL)
        : '';
      const nationalNo = googleNumber
        ? this.phoneUtil.format(googleNumber, PhoneNumberFormat.NATIONAL)
        : '';

      // if (this.separateDialCode && internationallNo) {
      //   this.phoneNumber = this.removeDialCode(internationallNo);
      // }

      this.emitValueChange({
        internationalNumber: internationallNo,
        nationalNumber: nationalNo,
        isoCode: this.country?.isoCode || "",
        dialCode: this.dialCodePrefix + this.country?.dialCode,
      });
    }
  }

  onNumberKeyDown(event: KeyboardEvent) {
    const allowedChars = /^[0-9\+\-\(\)\.\ ]/;
    const allowedCtrlChars = /[axcv]/;
    const allowedOtherKeys = [
      'ArrowLeft',
      'ArrowUp',
      'ArrowRight',
      'ArrowDown',
      'Home',
      'End',
      'Insert',
      'Delete',
      'Backspace',
      'Tab'
    ];

    const isCtrlKey = event.ctrlKey || event.metaKey;

    if (
      !allowedChars.test(event.key) &&
      !(isCtrlKey && allowedCtrlChars.test(event.key)) &&
      !allowedOtherKeys.includes(event.key)
    ) {
      event.preventDefault();
    }
  }

  private filterCountries(text: string): CountryI[] {
    return this.countries.filter((country) => {
      return (
        country.name.toLowerCase().indexOf(text) !== -1 ||
        country.name.toLowerCase().indexOf(text) !== -1 ||
        country.dialCode.toString().toLowerCase().indexOf(text) !== -1
      );
    });
  }

  private getCountryIsoCode(
    countryCode: number,
    googleNumber: PhoneNumber
  ): string | undefined {
    const rawNumber = (googleNumber as any).values_[2].toString();

    const countries = this.countries.filter(
      (country: CountryI) => country.dialCode === countryCode.toString()
    );
    const mainCountry = countries.find(
      (country: CountryI) => country.areaCodes === undefined
    );
    const secondaryCountries = countries.filter(
      (country: CountryI) => country.areaCodes !== undefined
    );

    let matchedCountry = mainCountry ? mainCountry.isoCode : undefined;

    secondaryCountries.forEach((country) => {
      country?.areaCodes?.forEach((areaCode) => {
        if (rawNumber.startsWith(areaCode)) {
          matchedCountry = country.isoCode;
        }
      });
    });
    return matchedCountry;
  }

  private fetchAllCountries() {
    this.countries = this.IonInterTelInputService.getListOfCountries();
  }

  private getCountryByIsoCode(isoCode: string): any {
    for (const country of this.countries) {
      if (country.isoCode === isoCode) {
        return country;
      }
    }
    return;
  }

  private isNullOrWhiteSpace(value: any): boolean {
    if (value === null || value === undefined) {
      return true;
    }
    if (typeof value === 'string' && value === '') {
      return true;
    }
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return true;
    }
    return false;
  }

  private removeDialCode(phoneNumber: string): string {
    if (this.separateDialCode && phoneNumber) {
      phoneNumber = phoneNumber.substr(phoneNumber.indexOf(' ') + 1);
    }
    return phoneNumber;
  }

  private setCountry(country: CountryI): void {
    this.country = country;
    this.codeChange.emit(this.country);
  }

  private setPreferredCountries(): void {
    for (const preferedCountryIsoCode of this.preferredCountries) {
      const country = this.getCountryByIsoCode(preferedCountryIsoCode);
      country.priority = country ? 1 : country?.priority;
    }
    this.countries.sort((a, b) =>
      a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0
    );
  }

  private startsWith = (input: string, search: string): boolean => {
    return input.substr(0, search.length) === search;
  };

  private getClasses = (element: HTMLElement) => {
    const classList = element.classList;
    const classes = [];
    for (let i = 0; i < classList.length; i++) {
      const item = classList.item(i);
      if (item !== null && this.startsWith(item, 'ng-')) {
        classes.push(`ion-${item.substr(3)}`);
      }
    }
    return classes;
  };

  private setClasses = (element: HTMLElement, classes: string[]) => {
    const classList = element.classList;
    [
      'ion-valid',
      'ion-invalid',
      'ion-touched',
      'ion-untouched',
      'ion-dirty',
      'ion-pristine',
    ].forEach((c) => classList.remove(c));

    classes.forEach((c) => classList.add(c));
  };

  private setIonicClasses = (element: ElementRef) => {
    raf(() => {
      const input = element.nativeElement as HTMLElement;
      const classes = this.getClasses(input);
      this.setClasses(input, classes);

      const item = input.closest('ion-item');
      if (item) {
        this.setClasses(item, classes);
      }
    });
  };

  private setItemClass = (
    element: ElementRef,
    className: string,
    addClass: boolean
  ) => {
    const input = element.nativeElement as HTMLElement;
    const item = input.closest('ion-item');
    if (item) {
      const classList = item.classList;
      if (addClass) {
        classList.add(className);
      } else {
        classList.remove(className);
      }
    }
  };
}