import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account } from '../../models/ChartAccount';
import { NatureType } from '../../models/NatureType';
import { ClasificationType } from '../../models/ClasificationType';
import { FinancialStateType } from '../../models/FinancialStateType';
import { ChartAccountService } from '../../services/chart-account.service';

/**
 * Angular component to create and edit accounting accounts.
 */
@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.css'
})
export class AccountFormComponent implements OnInit {

  /**
   * Data received from parent component, account category, parent, level
   */
  @Input() currentLevelAccount: string = '';
  @Input() parent?: Account;
  @Input() level: number = 0;

  /**
   * values ​​emitted from child component, new account (created, edited), cancel event
   */
  @Output() newAccount = new EventEmitter<Account>(); 
  @Output() cancelar = new EventEmitter<void>(); 

  /**
   * lists containing additional data
   */
  listNature: NatureType[] = [];
  listFinancialState: FinancialStateType[] = [];
  listClasification: ClasificationType[] = [];

  /**
   * Form
   */
  formNewAccount: FormGroup;

  /**
   * Placeholder
   */
  placeNatureType: string = 'Seleccione una opción';
  placeFinancialStateType: string = 'Seleccione una opción';
  placeClassificationType: string = 'Seleccione una opción';

  /**
   * message depending on the level
   */
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

  /**
   * Handle changes to inputs (@Input).
   * @param changes Object that contains the changes made.
   */
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

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.getNatureType();
    this.getFinancialStateType();
    this.getClasificationType();
    this.asignMessage();
  }

  /**
   * Assigns the code length message based on account level.
   */
  asignMessage() {
    this.messageLength = this.level === 1 ? 'un dígito' : 'dos dígitos';
  }

  /**
   * Raises the newAccount event with the new accounting account created.
   */
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


  /**
   * Gets the company ID from localStorage.
   * @returns The company ID
   */
  getIdEnterprise(): string {
    const entData = localStorage.getItem('entData');
    return entData ? JSON.parse(entData).entId : '';
  }

  /**
   * Gets the nature types from the service.
   */
  getNatureType() {
    this.listNature = this._accountService.getNatureType();
  }

  /**
   * Gets the financial statement types from the service.
   */
  getFinancialStateType() {
    this.listFinancialState = this._accountService.getFinancialStateType();
  }

  /**
   * Gets the classification types from the service.
   */
  getClasificationType() {
    this.listClasification = this._accountService.getClasificationType();
  }

  /**
   * Handles the selection of financial statement type.
   * @param event Selection event.
   */
  onSelectionFinancialStateType(event: any) {
    this.formNewAccount.get('selectedFinancialStateType')?.setValue(event.name);
    this.placeFinancialStateType = '';
  }

  /**
   * Handles nature type selection.
   * @param event Selection event.
   */
  onSelectionNatureType(event: any) {
    this.formNewAccount.get('selectedNatureType')?.setValue(event.name);
    this.placeNatureType = '';
  }
    
  /**
   * Handles classification type selection.
   * @param event Selection event.
   */  
  onSelectionClasificationType(event: any) {
    this.formNewAccount.get('selectedClassificationType')?.setValue(event.name);
    this.placeClassificationType = '';
  }

  /**
   * Handles deletion of financial statement type selection.
   */
  onSelectionFinancialStateTypeClear() {
    this.formNewAccount.get('selectedFinancialStateType')?.setValue('');
  }

  /**
   * Handles deletion of nature type selection.
   */
  onSelectionNatureTypeClear() {
    this.formNewAccount.get('selectedNatureType')?.setValue('');
  }

  /**
   * Handles clearing the sorting type selection.
   */
  onSelectionClassificationTypeClear() {
    this.formNewAccount.get('selectedClassificationType')?.setValue('');
  }

  /**
   * Issues the cancel event.
   */
  cancel() {
    this.cancelar.emit();
  }

}
