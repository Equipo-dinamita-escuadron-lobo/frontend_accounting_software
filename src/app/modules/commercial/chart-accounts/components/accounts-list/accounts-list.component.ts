import { Component } from '@angular/core';
import { Account } from '../../models/ChartAccount';
import {FormBuilder,FormGroup, FormControl, Validators, AbstractControl} from '@angular/forms';
import { ChartAccountService } from '../../services/chart-account.service';
import { NatureType } from '../../models/NatureType';
import { ClasificationType } from '../../models/ClasificationType';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrl: './accounts-list.component.css'
})
export class AccountsListComponent {
  filterAccount:string = '';

  //
  accountForm: FormGroup;
  formTransactional: FormGroup;

  //
  showFormTransactional: boolean = false;

  //
  showButton = false;

  //
  className = ''; 
  groupName = ''; 
  accountName = ''; 
  subAccountName = ''; 
  auxiliaryName = '';

  //
  inputAccess = {
    class: true,
    group: true,
    account: true,
    subAccount: true,
    auxiliary: true
  };

  //Arrays with information of services
  listFinancialState: ClasificationType[] = [];
  listAccounts: Account[] = [];
  listNature: NatureType[] = [];
  listClasification: ClasificationType[] = [];

  /**
   * PlaceHolder
   */
  placeNatureType: string = '';
  placeFinancialStateType: string = '';
  placeClasificationType: string = '';

  constructor(
    private fb: FormBuilder, 
    private _accountService: ChartAccountService) {
    this.accountForm = this.fb.group({})
    this.formTransactional = this.fb.group(this.vallidationsFormTansactional());
  }

  vallidationsFormTansactional(){
    return {
      selectedNatureType: [null, [this.selectedValueValidator]],
      selectedFinancialStateType: [null, [this.selectedValueValidator]],
      selectedClasificationType: [null, [this.selectedValueValidator]],
    }
  }

  ngOnInit(): void {
    this.getAccounts();
    this.getNatureType();
    this.getFinancialStateType();
    this.getClasificationType();
  }

  selectedValueValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    if (
      control.value !== null &&
      control.value !== undefined &&
      control.value !== ''
    ) {
      return null; // El valor es válido
    } else {
      return { noValueSelected: true }; // El valor no es válido
    }
  }
  
  toggleSubAccounts(account: Account) {
    account.showSubAccounts = !account.showSubAccounts;
  }

  selectAccount(account: Account) { 
    this.accountHasInformation(account);
    this.createForm(account); 
    this.showFormTransactional = true;
  } 
  createForm(selectedAccount: Account) { 
    this.accountForm = this.fb.group({}); 
    this.showButton = true;

    this.assignName(selectedAccount.code, selectedAccount.name);
    this.updateInputAccess(selectedAccount.code.length);

    this.accountForm.addControl('className', new FormControl({ value: this.className, disabled: this.inputAccess.class }));
    this.accountForm.addControl('classCode', new FormControl({value: selectedAccount.code.slice(0, 1), disabled: this.inputAccess.class })); 
      
    if (selectedAccount.code.length >= 2) { 
    this.accountForm.addControl('groupName', new FormControl({value: this.groupName, disabled: this.inputAccess.group })); 
    this.accountForm.addControl('groupCode', new FormControl({value: selectedAccount.code.slice(0, 2), disabled: this.inputAccess.group })); 

      if (selectedAccount.code.length >= 4) { 
        this.accountForm.addControl('accountName', new FormControl({value: this.accountName, disabled: this.inputAccess.account })); 
        this.accountForm.addControl('accountCode', new FormControl(selectedAccount.code.slice(0,4) )); 
        this.accountForm.addControl('codeAccount', new FormControl({value: selectedAccount.code.slice(2,4), disabled: this.inputAccess.account })); 

        if (selectedAccount.code.length >= 6) { 
          this.accountForm.addControl('subAccountName', new FormControl({value: this.subAccountName, disabled: this.inputAccess.subAccount })); 
          this.accountForm.addControl('subAccountCode', new FormControl(selectedAccount.code.slice(0, 6))); 
          this.accountForm.addControl('codeSubAccount', new FormControl({value: selectedAccount.code.slice(4,6), disabled: this.inputAccess.subAccount }));
          
          if (selectedAccount.code.length >= 8) { 
            this.accountForm.addControl('auxiliaryName', new FormControl({value: this.auxiliaryName, disabled: this.inputAccess.auxiliary })); 
            this.accountForm.addControl('auxiliaryCode', new FormControl(selectedAccount.code.slice(0, 8))); 
            this.accountForm.addControl('codeAuxiliary', new FormControl({value: selectedAccount.code.slice(6,8), disabled: this.inputAccess.auxiliary })); 
          } 
        }
      }
    }
  }

  assignName(code: string, name: string) {
    this.className = '';
    this.groupName = '';
    this.accountName = '';
    this.subAccountName = '';
    this.auxiliaryName = '';

    this.className = this.findAccountByCode(this.listAccounts, code.slice(0, 1));
    this.groupName = this.findAccountByCode(this.listAccounts, code.slice(0, 2));
    this.accountName = this.findAccountByCode(this.listAccounts, code.slice(0, 4));
    this.subAccountName = this.findAccountByCode(this.listAccounts, code.slice(0, 6));
    this.auxiliaryName = this.findAccountByCode(this.listAccounts, code.slice(0, 8));

    switch (code.length) {
      case 1:
        this.className = name;
        break;
      case 2:
        this.groupName = name;
        break;
      case 4:
        this.accountName = name;
        break;
      case 6:
        this.subAccountName = name;
        break;
      case 8:
        this.auxiliaryName = name;
        break;
    }
  }

  findAccountByCode(accounts: Account[], code: string): string {
    for (const account of accounts) {
      if (account.code === code) {
        return account.name;
      }
      if (account.subAccounts) {
        const foundAccount = this.findAccountByCode(account.subAccounts, code);
        if (foundAccount !== '') {
          return foundAccount;
        }
      }
    }
    return '';
  }

  updateInputAccess(code: number) {
    this.inputAccess = {
      class: true,
      group: true,
      account: true,
      subAccount: true,
      auxiliary: true
    };
    this.inputAccess = {
      class: !(code == 1),
      group: !(code == 2),
      account: !(code == 4),
      subAccount: !(code == 6),
      auxiliary: !(code == 8)
    };
  }

  getNatureType() {
    this.listNature = this._accountService.getNatureType();
  }

  getAccounts() {
    this.listAccounts = this._accountService.getAccounts();
  }

  getFinancialStateType() {
    this.listFinancialState = this._accountService.getFinancialStateType();
  }

  getClasificationType() {
    this.listClasification = this._accountService.getClasificationType();
  }

  onSelectionFinancialStateType(event: any) {
    this.formTransactional.value.selectedFinancialStateType = event;
    this.placeFinancialStateType = '';
  }

  onSelectionNatureType(event: any) {
    this.formTransactional.value.selectedNatureType = event;
    this.placeNatureType = '';
  }

  onSelectionClasificationType(event: any) {
    this.formTransactional.value.selectedClasificationType = event;
    this.placeClasificationType = '';
  }

  onSelectionFinancialStateTypeClear() {
    this.formTransactional.value.selectedFinancialStateType = { id: -1, name: '' };
  }

  onSelectionNatureTypeClear() {
    this.formTransactional.value.selectedNatureType = { id: -1, name: '' };
  }

  onSelectionclasificationTypeClear() {
    this.formTransactional.value.selectedClasificationType = { id: -1, name: '' };
  }

  accountHasInformation(selectedAccount: Account) {
    this.placeNatureType = 'Seleccione una opción';
    this.placeFinancialStateType = 'Seleccione una opción';
    this.placeClasificationType = 'Seleccione una opción';

    this.formTransactional.patchValue({'selectedNatureType': null});
    this.formTransactional.patchValue({'selectedFinancialStateType': null});
    this.formTransactional.patchValue({'selectedClasificationType': null});

    if (selectedAccount.nature.length > 0) {
      this.formTransactional.patchValue({'selectedNatureType': selectedAccount.nature});
      this.placeNatureType = '';
    }

    if (selectedAccount.financialState.length > 0) {
      this.formTransactional.patchValue({'selectedFinancialStateType': selectedAccount.financialState});
      this.placeFinancialStateType = '';
    }

    if (selectedAccount.clasification.length > 0) {
      this.formTransactional.patchValue({'selectedClasificationType': selectedAccount.clasification});
      this.placeClasificationType = '';
    }
  }

  saveAccount(){
    console.log(this.accountForm.value);
  }
}
