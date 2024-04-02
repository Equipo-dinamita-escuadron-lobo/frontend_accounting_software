import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, Self, ViewChild, forwardRef, input} from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl, ValidationErrors, Validators } from '@angular/forms';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckButtonComponent),
  multi: true
};


@Component({
  selector: 'app-check-button',
  templateUrl: './check-button.component.html',
  styleUrl: './check-button.component.css',
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class CheckButtonComponent implements ControlValueAccessor, OnInit{
  @Input() texto: string = "";
  @Input() value: string = "";
  @Input() tailConfig: string = "";
  @ViewChild('input')  inputRef!:ElementRef; 
  @Output() blur: EventEmitter<void> = new EventEmitter<void>();
  @Output() isCheckedChange = new EventEmitter<boolean>();
  @Input() isChecked = false;
  disabled!: boolean;
  private _controlDir?: NgControl | null=null;

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};


  constructor(private injector: Injector) {}

  ngOnInit(): void {

    setTimeout(() => {
      this._controlDir = this.injector.get(NgControl, null);
      if (this._controlDir) {
        this._controlDir.valueAccessor = this;
        const control = this._controlDir.control;
        const validators = control?.validator
        ? [control.validator, Validators.required]
        : Validators.required;
      control?.setValidators(validators);
      }
    });

  }
  
  toggleChecked(): void {
    this.isChecked = !this.isChecked;
    const valueToSend = this.isChecked ? this.value : "";
    this.isCheckedChange.emit(this.isChecked);
    this.onChange(valueToSend); // Notifica a Angular el cambio de valor
    this.onTouched(); // Marca el control como "tocado"
  }

  writeValue(value: any): void {
    if (this._controlDir && this._controlDir.control && this.isChecked) {
      value && this._controlDir.control.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(onChange: (value: any) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
       


}

