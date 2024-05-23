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
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrl: './accounts-list.component.css'
})
export class AccountsListComponent implements OnInit {
  //form showing inputs
  accountForm: FormGroup;
  //Form showing selects
  formTransactional: FormGroup;

  //variables for flat file import
  filterAccount: string = '';
  listExcel: Account[] = [];
  listAccountsToShow: Account[] = [];
  importedAccounts: boolean = false;
  importedFailed: boolean = false;

  //Account selected
  accountSelected?: Account;

  num: number = 0;
  code: string = '';
  name: string = '';
  parentId: string = '';

  //Variables for show forms
  showPrincipalForm: boolean = false;         //Form with inputs
  showFormTransactional: boolean = false;     //Form with selects
  showFormNewAccount: boolean = false;        //Form child
  selectedAccount: boolean = false;           //When selected an account

  //Variables for show buttons
  showButton = false;
  showUpdateButton = false;
  showAddNewClass: boolean = false;
  showButtonDelete: boolean = false;

  //variables that are determined depending on the level
  currentLevelAccount: 'grupo' | 'cuenta' | 'subcuenta' | 'auxiliar' | 'clase' = 'clase';
  addChild: boolean = false;

  //variables that store the account name
  className = '';
  groupName = '';
  accountName = '';
  subAccountName = '';
  auxiliaryName = '';

  //determines which input is to be blocked depending on the level selected
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

  //variables that have the placeholder of the select
  placeNatureType: string = '';
  placeFinancialStateType: string = '';
  placeClasificationType: string = '';

  constructor(
    private fb: FormBuilder,
    private _accountService: ChartAccountService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef) {
    this.accountForm = this.fb.group({})
    this.formTransactional = this.fb.group(this.vallidationsFormTansactional());
  }

  showFormAddNewClass(){
    this.showAddNewClass = true;
    this.noAddNewChild();
    this.noShowPrincipalAndTransactionalForm();
  }

  noShowFormAddNewClass() {
    this.showAddNewClass = false;
    if(this.selectedAccount){
      this.showPrincipalAndTransactionalForm();
    }else{
      this.noShowPrincipalAndTransactionalForm();
    }
  }

  addNewChild(){
    this.addChild = true;
    this.showButton = false;
    this.showButtonDelete = false;
    this.showFormTransactional = false;
    this.showUpdateButton = false;
    if(this.accountSelected){
      this.updateInputAccess(parseInt(this.accountSelected.code));
    }
  }

  noAddNewChild(){
    this.addChild = false;
    this.showButton = true;
    this.showButtonDelete = true;
    this.showFormTransactional = true;
    this.updateInputAccess(this.num);
  }

  showPrincipalAndTransactionalForm(){
    this.showPrincipalForm = true;
    this.showFormTransactional = true;
    this.showButton = true;
    this.showButtonDelete = true;
  }

  noShowPrincipalAndTransactionalForm(){
    this.showPrincipalForm = false;
    this.showFormTransactional = false;
    this.showButton = false;
    this.showButtonDelete = false;
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
    this.noShowFormAddNewClass();
    this.accountHasInformation(account);
    this.createForm(account.code, account.description);
    this.selectedAccount = true;
    this.showUpdateButton = false;
    this.accountSelected = account;
  }

  //Ir creando los inputs de acuerdo a la cuenta seleccionada
  createForm(code: string, description: string) {
    this.accountForm = this.fb.group({}); // formulario vacio cada que selecciona una cuenta
    this.showPrincipalAndTransactionalForm();
    this.assignName(code, description); //para buscar la cuenta y asigna los nombres  dependiendo cuenta y nivel
    this.updateInputAccess(code.length); //para bloquear inputs de acuerdo al nivel
    this.code = '';
    this.name = '';
    this.parentId = '';

    if (code.length >= 1) {
      this.accountForm.addControl('className', new FormControl({ value: this.className, disabled: this.inputAccess.class },[Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1,. ]+$')]));  
      this.accountForm.addControl('classCode', new FormControl({ value: code.slice(0, 1), disabled: this.inputAccess.class }, [Validators.maxLength(1), Validators.minLength(1)])); 
      this.currentLevelAccount = 'grupo';
      this.num = 1;
      this.code = 'classCode';
      this.name = 'className';
    }

    if (code.length >= 2) {
      this.accountForm.addControl('groupName', new FormControl({ value: this.groupName, disabled: this.inputAccess.group },[Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1,. ]+$')]));
      this.accountForm.addControl('groupCode', new FormControl({ value: code.slice(0, 1), disabled: this.inputAccess.group }));
      this.accountForm.addControl('codeGroup', new FormControl({ value: code.slice(1, 2), disabled: this.inputAccess.group },[Validators.maxLength(1), Validators.minLength(1)]));
      this.currentLevelAccount = 'cuenta';
      this.num = 2;
      this.code = 'codeGroup';
      this.name = 'groupName';
      this.parentId = code.slice(0, 1);
    }

    if (code.length >= 4) {
      this.accountForm.addControl('accountName', new FormControl({ value: this.accountName, disabled: this.inputAccess.account },[Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1,. ]+$')]));
      this.accountForm.addControl('accountCode', new FormControl(code.slice(0, 2)));
      this.accountForm.addControl('codeAccount', new FormControl({ value: code.slice(2, 4), disabled: this.inputAccess.account },[Validators.maxLength(2), Validators.minLength(2)]));
      this.currentLevelAccount = 'subcuenta';
      this.num = 4;
      this.code = 'codeAccount';
      this.name = 'accountName';
      this.parentId = code.slice(0, 2);
    }

    if (code.length >= 6) {
      this.accountForm.addControl('subAccountName', new FormControl({ value: this.subAccountName, disabled: this.inputAccess.subAccount },[Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1,. ]+$')]));
      this.accountForm.addControl('subAccountCode', new FormControl(code.slice(0, 4)));
      this.accountForm.addControl('codeSubAccount', new FormControl({ value: code.slice(4, 6), disabled: this.inputAccess.subAccount },[Validators.maxLength(2), Validators.minLength(2)]));
      this.currentLevelAccount = 'auxiliar';
      this.num = 6;
      this.code = 'codeSubAccount';
      this.name = 'subAccountName';
      this.parentId = code.slice(0, 4);
    }

    if (code.length >= 8) {
      this.accountForm.addControl('auxiliaryName', new FormControl({ value: this.auxiliaryName, disabled: this.inputAccess.auxiliary },[Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1,. ]+$')]));
      this.accountForm.addControl('auxiliaryCode', new FormControl(code.slice(0, 6)));
      this.accountForm.addControl('codeAuxiliary', new FormControl({ value: code.slice(6, 8), disabled: this.inputAccess.auxiliary },[Validators.maxLength(2), Validators.minLength(2)]));
      this.num = 8;
      this.code = 'codeAuxiliary';
      this.name = 'auxiliaryName';
      this.parentId = code.slice(0, 6);
    }
    
    this.accountForm.valueChanges.subscribe(() => {
      this.showUpdateButton = this.shouldShowUpdateButton();
    });

    this.formTransactional.valueChanges.subscribe(() => {
      this.showUpdateButton = this.shouldShowUpdateButton();
    });

  }

  shouldShowUpdateButton(): boolean {
    const accountFormHasChanges = this.hasFormValueChanged(this.accountForm);
    const transactionalFormHasChanges = this.hasFormValueChanged(this.formTransactional);
    return accountFormHasChanges || transactionalFormHasChanges;
  }

  hasFormValueChanged(form: FormGroup): boolean {
    const formValues = form.value;
    for (const key in formValues){
      if (formValues.hasOwnProperty(key)) {
        const control = form.get(key);
        if (control && control.dirty) {
          return true; //Si algun control ha cambiado
        }
      }
    }
    return false; //Si ningun control ha cambiado
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

  updateInputAccess(code?: number) {
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

    if (selectedAccount && selectedAccount.nature && selectedAccount.nature.length > 0) {
      this.formTransactional.patchValue({ 'selectedNatureType': selectedAccount.nature });
      this.placeNatureType = '';
    }

    if (selectedAccount && selectedAccount.financialStatus && selectedAccount.financialStatus.length > 0) {
      this.formTransactional.patchValue({ 'selectedFinancialStateType': selectedAccount.financialStatus });
      this.placeFinancialStateType = '';
    }

    if (selectedAccount && selectedAccount.classification && selectedAccount.classification.length > 0) {
      this.formTransactional.patchValue({ 'selectedClasificationType': selectedAccount.classification });
      this.placeClasificationType = '';
    }
  }

  saveImportAccounts() {
    this.importedAccounts = false;
    this._accountService.saveAccountsImport(this.listAccounts)
  }

  cancelImportAccounts() {
    this.importedAccounts = false;
    this.listAccounts = this.listAccountsAux;
  }

  //save and cancel functions come from the child form (component account-form) and are implemented here

  /**
   * hides the form and shows the state it was in again
   */
  cancel(){
    if(this.showAddNewClass){
      this.noShowFormAddNewClass();
    }
    if(this.addChild){
      this.noAddNewChild();
    }
  }
  
  /**
   * 
   * @param $event Account with the information that was filled out in the child form
   * @description If a child account is added, then the parent's code is added, if it is a class, it is added normally
   */
  addNewAccount($event: Account){
    if(this.showAddNewClass){
      this.saveNewAccountType($event);
    }
    if(this.addChild){
      const account: Account = {
        code: this.accountSelected?.code + $event.code,
        description: $event.description,
        nature: $event.nature,
        financialStatus: $event.financialStatus,
        classification: $event.classification,
        parent: this.accountSelected?.code
      }
      console.log('Datos enviados: ',account);
      this.saveNewAccountType(account);
    } 
  }

  // Service CRUD methods

  /**
   * Get all accounts
   */
  getAccounts() {
    this._accountService.getListAccounts().subscribe({
      next: (accounts) => {
        // Filtra los elementos no nulos del array de cuentas
        console.log(accounts);
        this.listAccounts = accounts.filter(account => account !== null);
      },
    });
  }

  /**
   * 
   * @param account account that contains the information to save
   */
  async saveNewAccountType(account: Account) {
    try {  
      if(account){
        if(this.name === 'subAccountName' && this.accountSelected && this.accountSelected.children && this.accountSelected.children.length >= 2){
          Swal.fire({
              title: 'Error!',
              text: 'Solo se permiten dos cuentas auxiliares para esta subcuenta',
              icon: 'error',
          });
          this.selectAccount(this.accountSelected);
          this.noShowFormAddNewClass();
          this.noAddNewChild();
        }else{
          this._accountService.createAccount(account).subscribe(
            (response) => {
              Swal.fire({
                title: 'Creación exitosa!',
                text: 'Se ha creado la cuenta con éxito!',
                icon: 'success',
              });
              console.log('Cuenta creada: ',response);
              this.getAccounts();
              this.selectAccount(response);
              this.noShowFormAddNewClass();
              this.noAddNewChild();
            },
            (error) => {
              Swal.fire({
                  title: 'Error!',
                  text: 'Ha ocurrido un error al crear la cuenta!.',
                  icon: 'error',
                });
            }
          );
        }
      }
    } catch (error) {
      console.error('Error al guardar el tipo de cuenta:', error);
    }
  }

  /**
   * @param code Account code to delete
   */
  deleteAccount(code: string) {
    try {
      //const cod = '14';
      this._accountService.deleteAccount(code).subscribe(
        (response) => {
          Swal.fire({
            title: 'Eliminación exitosa!',
            text: 'Se ha eliminado la cuenta con éxito!',
            icon: 'success',
          });
          this.getAccounts();
          //this.selectAccount(response);
          this.noShowFormAddNewClass();
          this.noAddNewChild();
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

  updateAccount(){
    try {  
      if(this.accountSelected){
        const account: Account = {
          code: this.parentId + this.accountForm.get(this.code)?.value,
          description: this.accountForm.get(this.name)?.value,
          nature: this.formTransactional.get('selectedNatureType')?.value.name || '',
          financialStatus: this.formTransactional.get('selectedFinancialStateType')?.value.name || '',
          classification: this.formTransactional.get('selectedClasificationType')?.value.name || '',
        }
        console.log('Cuenta a actualizar: ',this.accountSelected);
        console.log('Datos actualizados: ',account);
        this._accountService.updateAccount(this.accountSelected?.id, account).subscribe(
        (response) => {
          Swal.fire({
            title: 'Actualización exitosa!',
            text: 'Se ha actualizado la cuenta con éxito!',
            icon: 'success',
          });
          this.getAccounts();
          this.selectAccount(response);
          this.noShowFormAddNewClass();
          this.noAddNewChild();
        },
        (error) => {
          //console.error('Error al crear la cuenta:', error);
          Swal.fire({
              title: 'Error!',
              text: 'Ha ocurrido un error al actualizar la cuenta!.',
              icon: 'error',
            });
          console.error('Error al actualizar la cuenta:', error);
        }
      );
    }
    } catch (error) {
      console.error('Error al actualizar la cuenta:', error);
    }
  }
}
