import { Component, OnInit } from '@angular/core';
import { Account } from '../../models/ChartAccount';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
export class AccountsListComponent implements OnInit {
  filterAccount: string = '';
  listExcel: Account[] = [];
  listAccountsToShow: Account[] = [];
  importedAccounts: boolean = false;
  importedFailed: boolean = false;

  accountSelect: Account | null = null;
  accountSelectP: Account | null = null;

  //Variables para crear desde 0
  messagePlaholderInput: string = 'Seleccione una opcion';
  showInputClass: boolean = false;
  showInputNewAccount: boolean = false;
  formNewTypeAccount: FormGroup;
  formTransactionalNewAccount: FormGroup;
  natureSelect: string = '';
  financeStatusSelect: string = '';
  selectClassification: string = '';

  showPrincipalForm: boolean = false;

  //
  accountForm: FormGroup;
  formTransactional: FormGroup;
  selectedAccount?: Account;

  //
  showFormTransactional: boolean = false;
  showFormNewAccount: boolean = false;
  addChild: boolean = false;

  //
  showButton = false;

  //
  currentLevelAccount: 'grupo' | 'cuenta' | 'subcuenta' | 'auxiliar' | 'clase' = 'clase';
  showAddNewClass: boolean = false;
  showButtonDelete: boolean = false;
  parentId: string = '';
  level: number = 0;

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
    private dialog: MatDialog) {
    this.accountForm = this.fb.group({})
    this.formTransactional = this.fb.group(this.vallidationsFormTansactional());
    this.formNewTypeAccount = this.fb.group(this.vallidationsFormTansactional());
    this.formNewTypeAccount = this.fb.group({
      newClassCode: ['', [Validators.required, Validators.maxLength(1), Validators.pattern('^[0-9]*$')]],
      newClassName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]]
    });
    this.formTransactionalNewAccount = this.fb.group({
      newSelecNature: ['', this.requireValueSelected],
      newSelectFinancialState: ['', this.requireValueSelected],
      newSelecClassification: ['', this.requireValueSelected]
    });
  }

  requireValueSelected = (control: FormControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || value === '') {
      return { noValueSelected: true };
    }
    return null;
  };

  showInputClassStatus() {
    this.showInputClass = true;
    this.showInputNewAccount = true;
    this.showPrincipalForm = false;
  }

  showFormAddNewClass() {
    this.showAddNewClass = true;
    this.showPrincipalForm = false;
    this.showFormTransactional = false;
    this.showButton = false;
    this.currentLevelAccount = 'clase';
  }

  noShowFormAddNewClass() {
    this.showAddNewClass = false;
    this.showButton = true;
  }

  addNewChild(){
    this.showFormTransactional = false;
    this.addChild = true;
    this.showButton = false;
    this.showButtonDelete = false;
  }

  noShowFormAddChild(){
    this.addChild = false;
  }

  showFormTransactionalAccount() {
    this.showFormTransactional = true;
  }

  noShowFormTransactional() {
    this.showFormTransactional = false;
  }

  noShowPrincipalFormF(){
    this.showPrincipalForm = false;
  }

  showPrincipalFormF(){
    this.showPrincipalForm = true;
  }

  noShowInputClassStatus(){
    this.showInputClass = false;
    this.showInputNewAccount = false;
    this.showPrincipalForm = true;
  }

  openModalDetails(): void {
    this.OpenDetailsImport('Detalles de importación ', AccountImportComponent)
  }

  OpenDetailsImport(title: any, component: any) {
    var _popUp = this.dialog.open(component, {
      width: '40%',
      height: '100px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '600ms',
      data: {
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
    this.selectedAccount = account;
    this.accountHasInformation(account);
    this.createForm(account);
    this.showFormTransactional = true;
    this.noShowFormAddNewClass();
    this.noShowFormAddChild();
  }

  //Ir creando los inputs de acuerdo a la cuenta seleccionada
  createForm(selectedAccount: Account) {
    this.accountForm = this.fb.group({}); // formulario vacio cada que selecciona una cuenta
    this.showButton = true; // mostrar guardar 
    this.showButtonDelete = true; // mostrar borrar;
    this.parentId = '';
    this.assignName(selectedAccount.code, selectedAccount.description); //para buscar la cuenta y asigna los nombres  dependiendo cuenta y nivel
    this.updateInputAccess(selectedAccount.code.length); //para bloquear inputs de acuerdo al nivel

    if (selectedAccount.code.length >= 1) {
      this.accountForm.addControl('className', new FormControl({ value: this.className, disabled: this.inputAccess.class }));  
      this.accountForm.addControl('classCode', new FormControl({ value: selectedAccount.code.slice(0, 1), disabled: this.inputAccess.class })); 
      this.currentLevelAccount = 'grupo';
      this.parentId = selectedAccount.code.slice(0,1);
    }

    if (selectedAccount.code.length >= 2) {
      this.accountForm.addControl('groupName', new FormControl({ value: this.groupName, disabled: this.inputAccess.group }));
      this.accountForm.addControl('groupCode', new FormControl({ value: selectedAccount.code.slice(0, 1), disabled: this.inputAccess.group }));
      this.accountForm.addControl('codeGroup', new FormControl({ value: selectedAccount.code.slice(1, 2), disabled: this.inputAccess.group }));
      this.currentLevelAccount = 'cuenta';
      this.parentId = selectedAccount.code.slice(0,2);
    }

    if (selectedAccount.code.length >= 4) {
      this.accountForm.addControl('accountName', new FormControl({ value: this.accountName, disabled: this.inputAccess.account }));
      this.accountForm.addControl('accountCode', new FormControl(selectedAccount.code.slice(0, 2)));
      this.accountForm.addControl('codeAccount', new FormControl({ value: selectedAccount.code.slice(2, 4), disabled: this.inputAccess.account }));
      this.currentLevelAccount = 'subcuenta';
      this.parentId = selectedAccount.code.slice(0,4);
    }

    if (selectedAccount.code.length >= 6) {
      this.accountForm.addControl('subAccountName', new FormControl({ value: this.subAccountName, disabled: this.inputAccess.subAccount }));
      this.accountForm.addControl('subAccountCode', new FormControl(selectedAccount.code.slice(0, 4)));
      this.accountForm.addControl('codeSubAccount', new FormControl({ value: selectedAccount.code.slice(4, 6), disabled: this.inputAccess.subAccount }));
      this.currentLevelAccount = 'auxiliar';
      this.parentId = selectedAccount.code.slice(0,6);
    }

    if (selectedAccount.code.length >= 8) {
      this.accountForm.addControl('auxiliaryName', new FormControl({ value: this.auxiliaryName, disabled: this.inputAccess.auxiliary }));
      this.accountForm.addControl('auxiliaryCode', new FormControl(selectedAccount.code.slice(0, 6)));
      this.accountForm.addControl('codeAuxiliary', new FormControl({ value: selectedAccount.code.slice(6, 8), disabled: this.inputAccess.auxiliary }));
      this.parentId = selectedAccount.code;
    }

    const selectedAccountData = this.findAccountByCode2(selectedAccount.code, this.listAccounts);
    // if (selectedAccountData) {
    //   // Haz lo que necesites con la cuenta encontrada
    //   console.log(selectedAccountData);
    // } else {
    //   console.log("No se encontró la cuenta correspondiente en la lista.");
    // }
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

  //Funcion que muestra las subcuentas
  findAccountByCode2(code: string, accounts: Account[]): Account | undefined {
    // Función auxiliar para buscar la cuenta por código
    function findAccount(account: Account[]): Account | undefined {
      for (const subAccount of account) {
        if (subAccount.code === code) {
          // Si se encuentra la cuenta, devuelve solo esa cuenta
          return {
            code: subAccount.code,
            description: subAccount.description,
            nature: subAccount.nature,
            financialStatus: subAccount.financialStatus,
            classification: subAccount.classification
          };
        }
        if (subAccount.children) {
          // Realiza la búsqueda en las subcuentas
          const foundAccount = findAccount(subAccount.children);
          if (foundAccount) {
            // Si se encuentra la cuenta en las subcuentas, devuelve la cuenta principal con la ruta hasta la cuenta encontrada
            return {
              code: subAccount.code,
              description: subAccount.description,
              nature: subAccount.nature,
              financialStatus: subAccount.financialStatus,
              classification: subAccount.classification,
              children: [foundAccount]
            };
          }
        }
      }
      return undefined;
    }

    // Inicia la búsqueda en las cuentas principales
    for (const account of accounts) {
      const foundAccount = findAccount([account]); // Llama a la función auxiliar para buscar la cuenta
      if (foundAccount) {
        return foundAccount; // Devuelve la cuenta principal hasta la cuenta encontrada
      }
    }

    return undefined; // Devuelve undefined si no se encuentra la cuenta
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
        description: item['Nombre'],
        nature: item['Naturaleza'],
        financialStatus: item['Estado Financiero'],
        classification: item['Clasificación'] // Corregido el nombre del campo
      }));

      if (this.listExcel) {
        this.importedAccounts = true;
        //console.log(this.importedAccounts);
      }

      //console.log(this.createHierarchyWithParent(this.listExcel));
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
        hierarchy[code] = { ...account, children: [] };
      } else {
        hierarchy[code].description = account.description;
      }

      if (level >= 1) {
        const parentCode = code.slice(0, -2);
        if (!hierarchy[parentCode]) {
          hierarchy[parentCode] = { code: parentCode, description: '', nature: '', financialStatus: '', classification: '', children: [] };
        }
        hierarchy[parentCode].children?.push(hierarchy[code]);
      }
    }

    // Asociar cada cuenta principal al padre con un solo dígito en el código
    for (const account of Object.values(hierarchy)) {
      if (account.code.length === 2) {
        const parentCode = account.code[0];
        const parentAccount = hierarchy[parentCode];
        if (parentAccount) {
          parentAccount.children?.push(account);
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
        return account.description;
      }
      if (account.children) {
        const foundAccount = this.findAccountByCode(account.children, code);
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
    this._accountService.getListAccounts().subscribe({
      next: (accounts) => {
        // Filtra los elementos no nulos del array de cuentas
        this.listAccounts = accounts.filter(account => account !== null);
      },
    });
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

    // Verifica que selectedAccount no sea undefined y que tenga la propiedad nature definida
    if (selectedAccount && selectedAccount.nature && selectedAccount.nature.length > 0) {
      this.formTransactional.patchValue({ 'selectedNatureType': selectedAccount.nature });
      this.placeNatureType = '';
    }

    // Verifica que selectedAccount no sea undefined y que tenga la propiedad financialStatus definida
    if (selectedAccount && selectedAccount.financialStatus && selectedAccount.financialStatus.length > 0) {
      this.formTransactional.patchValue({ 'selectedFinancialStateType': selectedAccount.financialStatus });
      this.placeFinancialStateType = '';
    }

    // Verifica que selectedAccount no sea undefined y que tenga la propiedad clasification definida
    if (selectedAccount && selectedAccount.classification && selectedAccount.classification.length > 0) {
      this.formTransactional.patchValue({ 'selectedClasificationType': selectedAccount.classification });
      this.placeClasificationType = '';
    }
  }


  deleteAccount(code: string) {
    try {
      this._accountService.deleteAccount(code).subscribe(
        (response) => {
          Swal.fire({
            title: 'Eliminación exitosa!',
            text: 'Se ha eliminado la cuenta con éxito!',
            icon: 'success',
          });
          this.getAccounts()
          this.noShowPrincipalFormF();
          this.noShowFormTransactional();
          this.showButton = false;
        },
        (error) => {
          Swal.fire({
              title: 'Error!',
              text: 'Ha ocurrido un error al eliminar la cuenta!.',
              icon: 'error',
            });
        }
      );
    } catch (error) {
      console.error('Error al eliminar el tipo de cuenta:', error);
    }
  }

  itemSelectNature(e: any) {
    this.natureSelect = e.name;
    return e;
  }

  itemSelectFinanceStatus(e: any) {
    this.financeStatusSelect = e.name;
    return e;
  }

  itemSelectClassification(e: any) {
    this.selectClassification = e.name;
    return e;
  }

  async saveNewAccountType(account: Account) {
    try {  
      // Llamada al servicio para crear la cuenta
      if(account){
        this._accountService.createAccount(account).subscribe(
        (response) => {
          //console.log('Cuenta creada exitosamente:', response);
          Swal.fire({
            title: 'Creación exitosa!',
            text: 'Se ha creado la cuenta con éxito!',
            icon: 'success',
          });
          this.noShowFormAddNewClass();
          this.noShowFormAddChild();
          this.noShowPrincipalFormF();
          this.showButton = false;
          this.getAccounts()
        },
        (error) => {
          //console.error('Error al crear la cuenta:', error);
          Swal.fire({
              title: 'Error!',
              text: 'Ha ocurrido un error al crear la cuneta!.',
              icon: 'error',
            });
        }
      );
      }
    } catch (error) {
      console.error('Error al guardar el tipo de cuenta:', error);
    }
  }

  cancel(){
    if(this.showAddNewClass){
      this.noShowFormAddNewClass();
      this.showButton = false;
    }
    if(this.addChild){
      this.noShowFormAddChild();
      this.showButton = true;
    }
    this.showFormTransactionalAccount();
    this.showButtonDelete = true;
  }

  saveImportAccounts() {
    this.importedAccounts = false;
    this._accountService.saveAccountsImport(this.listAccounts)
  }

  cancelImportAccounts() {
    this.importedAccounts = false;
    this.listAccounts = this.listAccountsAux;
  }

  addNewAccount($event: Account){
    if(this.showAddNewClass){
      this.saveNewAccountType($event);
    }
    if(this.addChild){
      const account: Account = {
        code: this.parentId + $event.code,
        description: $event.description,
        nature: $event.nature,
        financialStatus: $event.financialStatus,
        classification: $event.classification,
        parent: this.parentId
      }
      this.saveNewAccountType(account);
    } 
  }
}
