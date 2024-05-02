import { Component } from '@angular/core';
import { Account } from '../../models/ChartAccount';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ChartAccountService } from '../../services/chart-account.service';
import { NatureType } from '../../models/NatureType';
import { ClasificationType } from '../../models/ClasificationType';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AccountImportComponent } from '../account-import/account-import.component';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrl: './accounts-list.component.css'
})
export class AccountsListComponent {
  filterAccount: string = '';
  listExcel: Account[] = [];
  listAccountsToShow: Account[] = [];
  importedAccounts: boolean = false;
  importedFailed: boolean = false;

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
  listAccountsAux: Account[] = [];
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
    private _accountService: ChartAccountService,
    private dialog:MatDialog) {
    this.accountForm = this.fb.group({})
    this.formTransactional = this.fb.group(this.vallidationsFormTansactional());
  }

  openModalDetails():void{
    this.OpenDetailsImport('Detalles de importación ',AccountImportComponent)
  }

  OpenDetailsImport(title:any ,component: any){
    var _popUp = this.dialog.open(component, {
      width: '40%',
      height: '100px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '600ms',
      data:{
        title: title
      }
    });
    _popUp.afterClosed().subscribe()
  }

  vallidationsFormTansactional() {
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
    this.accountForm.addControl('classCode', new FormControl({ value: selectedAccount.code.slice(0, 1), disabled: this.inputAccess.class }));

    if (selectedAccount.code.length >= 2) {
      this.accountForm.addControl('groupName', new FormControl({ value: this.groupName, disabled: this.inputAccess.group }));
      this.accountForm.addControl('groupCode', new FormControl({ value: selectedAccount.code.slice(0, 2), disabled: this.inputAccess.group }));

      if (selectedAccount.code.length >= 4) {
        this.accountForm.addControl('accountName', new FormControl({ value: this.accountName, disabled: this.inputAccess.account }));
        this.accountForm.addControl('accountCode', new FormControl(selectedAccount.code.slice(0, 4)));
        this.accountForm.addControl('codeAccount', new FormControl({ value: selectedAccount.code.slice(2, 4), disabled: this.inputAccess.account }));

        if (selectedAccount.code.length >= 6) {
          this.accountForm.addControl('subAccountName', new FormControl({ value: this.subAccountName, disabled: this.inputAccess.subAccount }));
          this.accountForm.addControl('subAccountCode', new FormControl(selectedAccount.code.slice(0, 6)));
          this.accountForm.addControl('codeSubAccount', new FormControl({ value: selectedAccount.code.slice(4, 6), disabled: this.inputAccess.subAccount }));

          if (selectedAccount.code.length >= 8) {
            this.accountForm.addControl('auxiliaryName', new FormControl({ value: this.auxiliaryName, disabled: this.inputAccess.auxiliary }));
            this.accountForm.addControl('auxiliaryCode', new FormControl(selectedAccount.code.slice(0, 8)));
            this.accountForm.addControl('codeAuxiliary', new FormControl({ value: selectedAccount.code.slice(6, 8), disabled: this.inputAccess.auxiliary }));
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

  ReadExcel(event: any) {
    let file = event.target.files[0];
  
    // Verificar si el archivo es de tipo xlsx
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      console.error('El archivo debe ser de tipo xlsx.');
      return;
    }
  
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
  
    fileReader.onload = (e) => {
      var workBook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetNames = workBook.SheetNames;
      let jsonData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
  
      // Verificar campos obligatorios
      const requiredFields = ['Código', 'Nombre', 'Naturaleza', 'Estado Financiero', 'Clasificación'];
      const missingFields = requiredFields.filter(field => {
        const obj = jsonData[0] as { [key: string]: any };
        return !Object.keys(obj).includes(field);
      });
  
      if (missingFields.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "El documento que quieres importar le falta algunos campos!",
          footer: '<button (click)="openModalDetails() class="text-purple-500">Obtener mas informacion!</button>'
        });
        console.error('Faltan los siguientes campos obligatorios:', missingFields.join(', '));
        return;
      }
  
      this.listExcel = jsonData.map((item: any) => ({
        code: item['Código'],
        name: item['Nombre'],
        nature: item['Naturaleza'],
        financialState: item['Estado Financiero'],
        clasification: item['Clasificación'] // Corregido el nombre del campo
      }));
  
      if (this.listExcel) {
        this.importedAccounts = true;
        console.log(this.importedAccounts);
      }
  
      console.log(this.createHierarchyWithParent(this.listExcel));
      this.listAccountsAux = this.listAccounts;
      this.listAccounts = this.createHierarchyWithParent(this.listExcel);
  
      // Resetear el valor del input de archivo
      event.target.value = null;
    };
  }

  createHierarchyWithParent(accounts: Account[]): Account[] {
    const hierarchy: Record<string, Account> = {};

    // Agrupar cuentas por código
    for (const account of accounts) {
      const code = account.code;
      const level = code.length / 2;

      if (!hierarchy[code]) {
        hierarchy[code] = { ...account, subAccounts: [] };
      } else {
        hierarchy[code].name = account.name;
      }

      if (level >= 1) {
        const parentCode = code.slice(0, -2);
        if (!hierarchy[parentCode]) {
          hierarchy[parentCode] = { code: parentCode, name: '', nature: '', financialState: '', clasification: '', subAccounts: [] };
        }
        hierarchy[parentCode].subAccounts?.push(hierarchy[code]);
      }
    }

    // Asociar cada cuenta principal al padre con un solo dígito en el código
    for (const account of Object.values(hierarchy)) {
      if (account.code.length === 2) {
        const parentCode = account.code[0];
        const parentAccount = hierarchy[parentCode];
        if (parentAccount) {
          parentAccount.subAccounts?.push(account);
        }
      }
    }

    // Obtener cuentas de nivel superior (clases)
    const topLevelAccounts: Account[] = [];
    for (const account of Object.values(hierarchy)) {
      if (account.code.length === 1) {
        topLevelAccounts.push(account);
      }
    }

    return topLevelAccounts;
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

    this.formTransactional.patchValue({ 'selectedNatureType': null });
    this.formTransactional.patchValue({ 'selectedFinancialStateType': null });
    this.formTransactional.patchValue({ 'selectedClasificationType': null });

    if (selectedAccount.nature.length > 0) {
      this.formTransactional.patchValue({ 'selectedNatureType': selectedAccount.nature });
      this.placeNatureType = '';
    }

    if (selectedAccount.financialState.length > 0) {
      this.formTransactional.patchValue({ 'selectedFinancialStateType': selectedAccount.financialState });
      this.placeFinancialStateType = '';
    }

    if (selectedAccount.clasification.length > 0) {
      this.formTransactional.patchValue({ 'selectedClasificationType': selectedAccount.clasification });
      this.placeClasificationType = '';
    }
  }

  saveAccount() {
    console.log(this.accountForm.value);
  }

  saveImportAccounts() {
    this.importedAccounts = false;
    this._accountService.saveAccountsImport(this.listAccounts)
  }

  cancelImportAccounts() {
    this.importedAccounts = false;
    this.listAccounts = this.listAccountsAux;
  }
}
