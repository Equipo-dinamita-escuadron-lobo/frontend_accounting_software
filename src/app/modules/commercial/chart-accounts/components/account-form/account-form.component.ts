import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account } from '../../models/ChartAccount';
import { NatureType } from '../../models/NatureType';
import { ClasificationType } from '../../models/ClasificationType';
import { FinancialStateType } from '../../models/FinancialStateType';
import { ChartAccountService } from '../../services/chart-account.service';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.css'
})
export class AccountFormComponent implements OnInit {

  @Input() currentLevelAccount: string = '';
  @Input() parent?: Account;
  @Input() level: number = 0;
  @Output() newAccount = new EventEmitter<Account>(); 
  @Output() cancelar = new EventEmitter<void>(); 

  listNature: NatureType[] = [];
  listFinancialState: FinancialStateType[] = [];
  listClasification: ClasificationType[] = [];

  formNewAccount: FormGroup;

  placeNatureType: string = 'Seleccione una opción';
  placeFinancialStateType: string = 'Seleccione una opción';
  placeClassificationType: string = 'Seleccione una opción';

  messageLength: string = '';

  constructor(private _accountService: ChartAccountService, private fb: FormBuilder) {
    this.formNewAccount = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1]+[a-zA-ZÀ-ÿ\u00f1\u00d1\\d,.()\\/\\-+&% ]*$')]],
      selectedNatureType: ['', [Validators.required]],
      selectedFinancialStateType: ['', [Validators.required]],
      selectedClassificationType: ['', [Validators.required]]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['level']) {
      const validators = [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.maxLength(this.level),
        Validators.minLength(this.level)
      ];
      this.formNewAccount.get('code')?.setValidators(validators);
      this.formNewAccount.get('code')?.updateValueAndValidity();
    }

    if (changes['parent'] && this.parent) {
      const nature = this.parent.nature === 'Por defecto' ? '' : this.parent.nature;
      const financialStatus = this.parent.financialStatus === 'Por defecto' ? '' : this.parent.financialStatus;
      const classification = this.parent.classification === 'Por defecto' ? '' : this.parent.classification;

      this.formNewAccount.patchValue({
        selectedNatureType: nature || '',
        selectedFinancialStateType: financialStatus || '',
        selectedClassificationType: classification || ''
      });

      this.placeNatureType = this.parent.nature === 'Por defecto' ? 'Seleccione una opción' : '';
      this.placeFinancialStateType = this.parent.financialStatus === 'Por defecto' ? 'Seleccione una opción' : '';
      this.placeClassificationType = this.parent.classification === 'Por defecto' ? 'Seleccione una opción' : '';
    }
  }

  ngOnInit(): void {
    this.getNatureType();
    this.getFinancialStateType();
    this.getClasificationType();
    this.asignMessage();
  }

  asignMessage() {
    this.messageLength = this.level === 1 ? 'un dígito' : 'dos dígitos';
  }

  sendAccount() {
    const account: Account = {
      idEnterprise: this.getIdEnterprise(),
      code: this.formNewAccount.value.code,
      description: this.formNewAccount.value.name,
      nature: this.formNewAccount.value.selectedNatureType,
      classification: this.formNewAccount.value.selectedClassificationType,
      financialStatus: this.formNewAccount.value.selectedFinancialStateType,
      parent: 0,
    };
    this.newAccount.emit(account);
  }

  getIdEnterprise(): string {
    const entData = localStorage.getItem('entData');
    return entData ? JSON.parse(entData).entId : '';
  }

  getNatureType() {
    this.listNature = this._accountService.getNatureType();
  }

  getFinancialStateType() {
    this.listFinancialState = this._accountService.getFinancialStateType();
  }

  getClasificationType() {
    this.listClasification = this._accountService.getClasificationType();
  }

  onSelectionFinancialStateType(event: any) {
    this.formNewAccount.get('selectedFinancialStateType')?.setValue(event.name);
    this.placeFinancialStateType = '';
  }

  onSelectionNatureType(event: any) {
    this.formNewAccount.get('selectedNatureType')?.setValue(event.name);
    this.placeNatureType = '';
  }
    
  onSelectionClasificationType(event: any) {
    this.formNewAccount.get('selectedClassificationType')?.setValue(event.name);
    this.placeClassificationType = '';
  }

  onSelectionFinancialStateTypeClear() {
    this.formNewAccount.get('selectedFinancialStateType')?.setValue('');
  }

  onSelectionNatureTypeClear() {
    this.formNewAccount.get('selectedNatureType')?.setValue('');
  }

  onSelectionClassificationTypeClear() {
    this.formNewAccount.get('selectedClassificationType')?.setValue('');
  }

  cancel() {
    this.cancelar.emit();
  }

}
