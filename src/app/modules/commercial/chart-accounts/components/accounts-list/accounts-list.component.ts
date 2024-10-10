import { Component, OnInit } from '@angular/core';
import { Account } from '../../models/ChartAccount';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ChartAccountService } from '../../services/chart-account.service';
import { NatureType } from '../../models/NatureType';
import { ClasificationType } from '../../models/ClasificationType';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AccountImportComponent } from '../account-import/account-import.component';
import { FinancialStateType } from '../../models/FinancialStateType';
import { Observable, forkJoin, of, switchMap, map } from 'rxjs';
import { AccountExportComponent } from '../account-export/account-export.component';
import { buttonColors } from '../../../../../shared/buttonColors';

/**
 * Component for managing and displaying chart of accounts.
 */
@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  providers: [AccountExportComponent], // Inyectar el componente aquí
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
  toggle: boolean = false;

  //variables that will store information about an account
  num: number = 0;
  code: string = '';
  name: string = '';
  parentId: string = '';

  //Variables for show forms
  showPrincipalForm: boolean = false;
  showFormTransactional: boolean = false;

  //selected account
  selectedAccount: boolean = false;

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
  listFinancialState: FinancialStateType[] = [];
  listAccounts: Account[] = [];
  listAccountsAux: Account[] = [];
  listNature: NatureType[] = [];
  listClasification: ClasificationType[] = [];

  //variables that have the placeholder of the select
  placeNatureType: string = '';
  placeFinancialStateType: string = '';
  placeClasificationType: string = '';

  constructor(
    private accountExportComponent: AccountExportComponent,
    private fb: FormBuilder,
    private _accountService: ChartAccountService,
    private dialog: MatDialog) {
    this.accountForm = this.fb.group({})
    this.formTransactional = this.fb.group({
      selectedNatureType: [''],
      selectedFinancialStateType: [''],
      selectedClasificationType: ['']
    });
  }


  /**
   * Shows the form for adding a new account class.
   */
  showFormAddNewClass() {
    this.showAddNewClass = true;
    this.noAddNewChild();
    this.noShowPrincipalAndTransactionalForm();
  }

  /**
   * Hides the form for adding a new account class.
   */
  noShowFormAddNewClass() {
    this.showAddNewClass = false;
    if (this.selectedAccount) {
      this.showPrincipalAndTransactionalForm();
    } else {
      this.noShowPrincipalAndTransactionalForm();
    }
  }

  /**
   * allows show the form for add a new child account
   */
  addNewChild() {
    this.addChild = true;
    this.showButton = false;
    this.showButtonDelete = false;
    this.showFormTransactional = false;
    this.showUpdateButton = false;
    if (this.accountSelected) {
      this.updateInputAccess(parseInt(this.accountSelected.code));
    }
  }

  /**
   * Disallows show the form for add a new child account.
   */
  noAddNewChild() {
    this.addChild = false;
    this.showButton = true;
    this.showButtonDelete = true;
    this.showFormTransactional = true;
    this.updateInputAccess(this.num);
  }

  /**
   * allows show the main form 
   */
  showPrincipalAndTransactionalForm() {
    this.showPrincipalForm = true;
    this.showFormTransactional = true;
    this.showButton = true;
    this.showButtonDelete = true;
  }

  /**
   * disallows show the main form 
   */
  noShowPrincipalAndTransactionalForm() {
    this.showPrincipalForm = false;
    this.showFormTransactional = false;
    this.showButton = false;
    this.showButtonDelete = false;
  }

  /**
   * Opens a modal dialog for import details.
   */
  openModalDetails(): void {
    this.OpenDetailsImport('Detalles de importación ', AccountImportComponent)
  }

  /**
   * Opens a modal dialog with a given title and component.
   * @param title The title of the modal dialog.
   * @param component The component to be displayed in the modal dialog.
   */
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

  /**
   * Initializes the component by fetching data from services.
   */
  ngOnInit(): void {
    this.getAccounts();

    this.getNatureType();
    this.getFinancialStateType();
    this.getClasificationType();
  }

  /**
   * Toggles the visibility of sub-accounts for a given account.
   * @param account The account for which to toggle sub-account visibility.
   */
  toggleSubAccounts(account: Account) {
    account.showSubAccounts = !account.showSubAccounts;
  }

  /**
   * Selects an account and updates the form with its data.
   * @param account The account to be selected.
   */
  selectAccount(account: Account) {
    this.noShowFormAddNewClass();
    this.noAddNewChild();
    this.accountHasInformation(account);
    this.createForm(account.code, account.description);
    this.selectedAccount = true;
    this.showUpdateButton = false;
    this.accountSelected = account;
  }

  /**
   * Creates the account form based on the selected account's code and description.
   * @param code The code of the selected account.
   * @param description The description of the selected account.
   */
  createForm(code: string, description: string) {
    this.accountForm = this.fb.group({});
    this.showPrincipalAndTransactionalForm();
    this.assignName(code, description);
    this.updateInputAccess(code.length);
    this.code = '';
    this.name = '';
    this.parentId = '';

    if (code.length >= 1) {
      this.accountForm.addControl('className', new FormControl({ value: this.className, disabled: this.inputAccess.class }, [Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1,. ]+$')]));
      this.accountForm.addControl('classCode', new FormControl({ value: code.slice(0, 1), disabled: this.inputAccess.class }, [Validators.maxLength(1), Validators.minLength(1)]));
      this.currentLevelAccount = 'grupo';
      this.num = 1;
      this.code = 'classCode';
      this.name = 'className';
    }

    if (code.length >= 2) {
      this.accountForm.addControl('groupName', new FormControl({ value: this.groupName, disabled: this.inputAccess.group }, [Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1,. ]+$')]));
      this.accountForm.addControl('groupCode', new FormControl({ value: code.slice(0, 1), disabled: this.inputAccess.group }));
      this.accountForm.addControl('codeGroup', new FormControl({ value: code.slice(1, 2), disabled: this.inputAccess.group }, [Validators.maxLength(1), Validators.minLength(1)]));
      this.currentLevelAccount = 'cuenta';
      this.num = 2;
      this.code = 'codeGroup';
      this.name = 'groupName';
      this.parentId = code.slice(0, 1);
    }

    if (code.length >= 4) {
      this.accountForm.addControl('accountName', new FormControl({ value: this.accountName, disabled: this.inputAccess.account }, [Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1,. ]+$')]));
      this.accountForm.addControl('accountCode', new FormControl(code.slice(0, 2)));
      this.accountForm.addControl('codeAccount', new FormControl({ value: code.slice(2, 4), disabled: this.inputAccess.account }, [Validators.maxLength(2), Validators.minLength(2)]));
      this.currentLevelAccount = 'subcuenta';
      this.num = 4;
      this.code = 'codeAccount';
      this.name = 'accountName';
      this.parentId = code.slice(0, 2);
    }

    if (code.length >= 6) {
      this.accountForm.addControl('subAccountName', new FormControl({ value: this.subAccountName, disabled: this.inputAccess.subAccount }, [Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1,. ]+$')]));
      this.accountForm.addControl('subAccountCode', new FormControl(code.slice(0, 4)));
      this.accountForm.addControl('codeSubAccount', new FormControl({ value: code.slice(4, 6), disabled: this.inputAccess.subAccount }, [Validators.maxLength(2), Validators.minLength(2)]));
      this.currentLevelAccount = 'auxiliar';
      this.num = 6;
      this.code = 'codeSubAccount';
      this.name = 'subAccountName';
      this.parentId = code.slice(0, 4);
    }

    if (code.length >= 8) {
      this.accountForm.addControl('auxiliaryName', new FormControl({ value: this.auxiliaryName, disabled: this.inputAccess.auxiliary }, [Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1,. ]+$')]));
      this.accountForm.addControl('auxiliaryCode', new FormControl(code.slice(0, 6)));
      this.accountForm.addControl('codeAuxiliary', new FormControl({ value: code.slice(6, 8), disabled: this.inputAccess.auxiliary }, [Validators.maxLength(2), Validators.minLength(2)]));
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

  /**
   * Determines whether the "Update" button should be shown based on form changes.
   * @returns Whether the "Update" button should be shown.
   */
  shouldShowUpdateButton(): boolean {
    const accountFormHasChanges = this.hasFormValueChanged(this.accountForm);
    const transactionalFormHasChanges = this.hasFormValueChanged(this.formTransactional);
    return accountFormHasChanges || transactionalFormHasChanges;
  }

  /**
   * Checks if any control in the given form has been modified.
   * @param form The form group to check.
   * @returns Whether any control in the form has been modified.
   */
  hasFormValueChanged(form: FormGroup): boolean {
    const formValues = form.value;
    for (const key in formValues) {
      if (formValues.hasOwnProperty(key)) {
        const control = form.get(key);
        if (control && control.dirty) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Assigns account names based on the code and description.
   * @param code The code of the account.
   * @param name The description of the account.
   */
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

  /**
   * Export accounts to an Excel file.
   */
  exportAccountsToExcel(): void {
    this.accountExportComponent.getAccounts().then((success) => {
      if (success) {
        Swal.fire({
          title: 'Éxito!',
          text: 'Se ha generado el archivo correctamente.',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'success'
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'No se encontraron cuentas para exportar.',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
      }
    });
  }

  /**
   * Sort the accounts by code.
   */
  sortAccountsRecursively(accounts: Account[]): Account[] {
    // Ordenamos la lista actual numéricamente
    accounts.sort((a, b) => parseInt(a.code) - parseInt(b.code));

    // Iteramos sobre cada cuenta para ordenar sus hijos recursivamente
    accounts.forEach(account => {
      if (account.children && account.children.length > 0) {
        // Si la cuenta tiene hijos, aplicamos la función recursiva
        account.children = this.sortAccountsRecursively(account.children);
      }
    });

    return accounts;
  }


  /**
   * Reads an Excel file and processes its data.
   * @param event The file input event.
   */
  ReadExcel(event: any) {
    let file = event.target.files[0];

    // Check if the file is of type xlsx
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      console.error('El archivo debe ser de tipo xlsx.');
      return;
    }

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e) => {
      var workBook = XLSX.read(fileReader.result, { type: 'binary', cellText: true });
      var sheetNames = workBook.SheetNames;

      // Convertimos la hoja a JSON con las columnas originales
      let jsonData: any[][] = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { raw: false, header: 1 });

      

      // Definir las columnas requeridas
      const requiredFields = ['Código', 'Nombre', 'Naturaleza', 'Estado Financiero', 'Clasificación'];

      // Filtrar solo las columnas deseadas antes de procesar las filas
      let headers = jsonData[0]; // La primera fila contiene los encabezados
      let indicesToKeep = headers.map((header: string, index: number) => requiredFields.includes(header) ? index : -1).filter(index => index !== -1);

      // Filtrar las columnas para todas las filas (incluyendo los encabezados)
      jsonData = jsonData.map(row => indicesToKeep.map(index => row[index]));

      // Filtrar filas que tengan celdas vacías o solo espacios
      let filteredRows = jsonData.filter(filtered => {
        return filtered.every(item => item !== null && item !== undefined && item !== "" && String(item).trim() !== '');
      });
      

      // Convertir el array a una hoja
      const worksheet = XLSX.utils.aoa_to_sheet(filteredRows);

      // Convertir la hoja a JSON
      let jsonDataFiltered = XLSX.utils.sheet_to_json(worksheet, { raw: false, header: headers });
      
      // Verificar si faltan campos obligatorios
      const missingFields = requiredFields.filter(field => {
        const obj = jsonDataFiltered[0] as { [key: string]: any };
        return !Object.keys(obj).includes(field);
      });

      if (missingFields.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "El documento que quieres importar le falta algunos campos!",
          confirmButtonColor: buttonColors.confirmationColor,
          footer: '<button (click)="openModalDetails()" class="text-purple-500">Obtener más información!</button>'
        });
        console.error('Faltan los siguientes campos obligatorios:', missingFields.join(', '));
        return;
      }
      // Eliminamos la primera fila (índice 0)
      jsonDataFiltered.shift();
      const idEnterprise = this.getIdEnterprise();

      this.listExcel = jsonDataFiltered.map((item: any) => ({
        idEnterprise: idEnterprise,
        code: String(item['Código']), // Ensure the code is a string
        description: item['Nombre'],
        nature: item['Naturaleza'],
        financialStatus: item['Estado Financiero'],
        classification: item['Clasificación']
      }));

      if (this.listExcel) {
        this.importedAccounts = true;
      }

      this.listAccountsAux = this.listAccounts;
      
      this.listAccounts = this.createHierarchyWithParent(this.listExcel);
      this.listAccounts = this.sortAccountsRecursively(this.listAccounts);

      // Reset file input value
      event.target.value = null;
    };
  }



  saveAccountHierarchy(accounts: Account[]): Observable<boolean> {
    const saveObservables = accounts.map(account => this.saveAccountRecursively(account));

    // Retornar el observable de forkJoin
    return forkJoin(saveObservables).pipe(
      // Aquí, cuando todas las operaciones terminen, devolvemos `true`
      map(() => true)
    );
  }

  saveAccountRecursively(account: Account, parentId: number = 0): Observable<Account> {
    // Set the parent ID
    account.parent = parentId;

    return this._accountService.createAccount(account).pipe(
      switchMap(savedAccount => {
        const accountId = savedAccount.id; // Assume the saved account has an `id` property

        if (account.children && account.children.length > 0) {
          const childObservables = account.children.map(child =>
            this.saveAccountRecursively(child, accountId)
          );

          // Use forkJoin to wait for all child observables to complete
          return forkJoin(childObservables).pipe(
            switchMap(() => of(savedAccount))
          );
        } else {
          return of(savedAccount);
        }
      })
    );
  }

  /**
   * Creates a hierarchy of accounts with parent-child relationships.
   * @param accounts The array of accounts to create the hierarchy from.
   * @returns The array of top-level accounts with their children.
   */
  createHierarchyWithParent(accounts: Account[]): Account[] {
    const hierarchy: Record<string, Account> = {};

    // Función para obtener el código del padre dependiendo del nivel
    const getParentCode = (code: string): string => {
      if (code.length > 6) return code.slice(0, 6);  // Subcuenta -> Cuenta
      if (code.length > 4) return code.slice(0, 4);  // Cuenta -> Grupo
      if (code.length > 2) return code.slice(0, 2);  // Grupo -> Clase
      if (code.length > 1) return code.slice(0, 1);  // Clase no tiene más padres
      return "";  // No hay padre para la Clase
    };

    // Agrupar cuentas por código
    for (const account of accounts) {
      const code = account.code;

      if (!hierarchy[code]) {
        hierarchy[code] = {
          ...account,
          children: [],
          idEnterprise: this.getIdEnterprise(),  // Asignar idEnterprise a la cuenta actual
          parent: ""  // Inicialmente, el parent es null
        };
      } else {
        hierarchy[code].description = account.description;
      }

      // Crear la jerarquía de padres hasta el nivel Clase
      let currentCode = code;
      let parentCode = getParentCode(currentCode);

      while (parentCode) {
        if (!hierarchy[parentCode]) {
          hierarchy[parentCode] = {
            code: parentCode,
            description: '',
            nature: '',
            financialStatus: '',
            classification: '',
            children: [],
            idEnterprise: this.getIdEnterprise(),  // Asignar idEnterprise al padre
            parent: getParentCode(parentCode)  // Obtener el padre del padre
          };
        }
        if (!hierarchy[currentCode].parent) {
          hierarchy[currentCode].parent = parentCode;  // Asignar parent_id a la cuenta actual si aún no se ha asignado
        }
        if (!hierarchy[parentCode].children?.includes(hierarchy[currentCode])) {
          hierarchy[parentCode].children?.push(hierarchy[currentCode]);  // Agregar solo si no está ya en la lista
        }

        // Pasar al siguiente nivel (más arriba en la jerarquía)
        currentCode = parentCode;
        parentCode = getParentCode(currentCode);
      }
    }

    // Obtener cuentas de nivel superior (clases)
    const topLevelAccounts: Account[] = [];
    for (const account of Object.values(hierarchy)) {
      if (account.code.length === 1) {  // Las cuentas de nivel más alto tienen un solo dígito (Clase)
        topLevelAccounts.push(account);
      }
    }

    return topLevelAccounts;
  }


  /**
   * Finds an account by its code and returns its description.
   * @param accounts The array of accounts to search in.
   * @param code The code of the account to find.
   * @returns The description of the found account, or an empty string if not found.
   */
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

  /**
   * Updates the input access based on the account level.
   * @param code The account level code (optional).
   */
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

  /**
   * Gets the list of nature types from the account service.
   */
  getNatureType() {
    this.listNature = this._accountService.getNatureType();
  }

  /**
   * Gets the list of financial state types from the account service.
   */
  getFinancialStateType() {
    this.listFinancialState = this._accountService.getFinancialStateType();
  }

  /**
   * Gets the list of classification types from the account service.
   */
  getClasificationType() {
    this.listClasification = this._accountService.getClasificationType();
  }

  /**
   * Handles the selection of a financial state type and sets the corresponding form value.
   * @param event The selection event.
   */
  onSelectionFinancialStateType(event: any) {
    this.formTransactional.get('selectedFinancialStateType')?.setValue(event.name);
    this.placeFinancialStateType = '';
  }

  /**
   * Handles the selection of a nature type and sets the corresponding form value.
   * @param event The selection event.
   */
  onSelectionNatureType(event: any) {
    this.formTransactional.get('selectedNatureType')?.setValue(event.name);
    this.placeNatureType = '';
  }

  /**
   * Handles the selection of a classification type and sets the corresponding form value.
   * @param event The selection event.
   */
  onSelectionClasificationType(event: any) {
    this.formTransactional.get('selectedClasificationType')?.setValue(event.name);
    this.placeClasificationType = '';
  }

  /**
   * Handles deletion of financial statement type selection.
   */
  onSelectionFinancialStateTypeClear() {
    this.formTransactional.get('selectedFinancialStateType')?.setValue('');
  }

  /**
   * Handles deletion of nature statement type selection.
   */
  onSelectionNatureTypeClear() {
    this.formTransactional.get('selectedNatureType')?.setValue('');
  }

  /**
   * Handles deletion of classification statement type selection.
   */
  onSelectionClasificationTypeClear() {
    this.formTransactional.get('selectedClasificationType')?.setValue('');
  }

  /**
   * Set the account information in the selector
   * @param selectedAccount account selected from list
   */
  accountHasInformation(selectedAccount: Account) {
    this.placeNatureType = 'Seleccione una opción';
    this.placeFinancialStateType = 'Seleccione una opción';
    this.placeClasificationType = 'Seleccione una opción';

    this.formTransactional.patchValue({ 'selectedNatureType': '' });
    this.formTransactional.patchValue({ 'selectedFinancialStateType': '' });
    this.formTransactional.patchValue({ 'selectedClasificationType': '' });

    if (selectedAccount && selectedAccount.nature && selectedAccount.nature != 'Por defecto') {
      this.formTransactional.patchValue({ 'selectedNatureType': selectedAccount.nature });
      this.placeNatureType = '';
    }

    if (selectedAccount && selectedAccount.financialStatus && selectedAccount.financialStatus != 'Por defecto') {
      this.formTransactional.patchValue({ 'selectedFinancialStateType': selectedAccount.financialStatus });
      this.placeFinancialStateType = '';
    }

    if (selectedAccount && selectedAccount.classification && selectedAccount.classification != 'Por defecto') {
      this.formTransactional.patchValue({ 'selectedClasificationType': selectedAccount.classification });
      this.placeClasificationType = '';
    }
  }

  /**
   * save the accounts that have been imported by calling the service
   */
  saveImportAccounts() {
    this.importedAccounts = false;
    this.saveAccountHierarchy(this.listAccounts).subscribe((result) => {
      if (result) {
        Swal.fire({
          title: '¡Importación exitosa!',
          text: 'Las cuentas han sido guardadas correctamente.',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        });
        this.ngOnInit();
      } else {
        Swal.fire({
          title: '¡Error al guardar!',
          text: 'Ocurrió un problema al guardar las cuentas importadas. Por favor, intente nuevamente o verifique los datos.',
          confirmButtonText: 'Entendido',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
      }
    });
  }




  /**
   * cancel the import of the file
   */
  cancelImportAccounts() {
    this.importedAccounts = false;
    this.listAccounts = this.listAccountsAux;
  }

  //save and cancel functions come from the child form (component account-form) and are implemented here
  /**
   * hides the form and shows the state it was in again
   */
  cancel() {
    if (this.showAddNewClass) {
      this.noShowFormAddNewClass();
    }
    if (this.addChild) {
      this.noAddNewChild();
    }
  }

  /**
   * If a child account is added, then the parent's code is added, if it is a class, it is added normally
   * @param $event Account with the information that was filled out in the child form
   */
  addNewAccount($event: Account) {
    if (this.showAddNewClass) {
      this.saveNewAccountType($event);
    }
    if (this.addChild) {
      if (this.accountSelected) {
        const account: Account = {
          idEnterprise: this.getIdEnterprise(),
          code: this.accountSelected?.code + $event.code,
          description: $event.description,
          nature: $event.nature,
          financialStatus: $event.financialStatus,
          classification: $event.classification,
          parent: this.accountSelected.id
        }
        this.saveNewAccountType(account);
      }
    }
  }

  /**
   * Gets the company ID from localStorage.
   * @returns The company ID
   */
  getIdEnterprise(): string {
    const entData = localStorage.getItem('entData');
    if (entData) {
      return JSON.parse(entData).entId;
    }
    return '';
  }

  // Service CRUD methods
  /**
   * Get all accounts
   * @returns A Promise that resolves when the accounts are fetched successfully, or rejects with an error.
   */
  getAccounts(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._accountService.getListAccounts(this.getIdEnterprise()).subscribe({
        next: (accounts) => {
          this.listAccounts = accounts.filter(account => account !== null);
          this.listAccounts = this.sortAccountsRecursively(this.listAccounts);
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  /**
   * Get an account by its code.
   * @param account The account object containing the code to search for.
   * @returns A Promise that resolves with a boolean indicating whether the account exists or not, or rejects with an error.
   */
  getAccountByCode(account: Account): Promise<boolean> {
    return this._accountService.getAccountByCode(account.code, this.getIdEnterprise()).toPromise()
      .then(cuenta => {
        return !!cuenta;
      })
      .catch(error => {
        console.error('Error al obtener la cuenta:', error);
        return false;
      });
  }

  /**
   * Save an account by calling the service
   * @param account account that contains the information to save
   */
  async saveNewAccountType(account: Account) {
    try {
      const accountExist = await this.getAccountByCode(account);
      if (!accountExist) {
        if (this.name === 'subAccountName' && this.accountSelected && this.accountSelected.children && this.accountSelected.children.length >= 2) {
          Swal.fire({
            title: 'Error!',
            text: 'Solo se permiten dos cuentas auxiliares para esta subcuenta!',
            confirmButtonColor: buttonColors.confirmationColor,
            icon: 'error',
          });
          this.selectAccount(this.accountSelected);
          this.noShowFormAddNewClass();
          this.noAddNewChild();
        } else {
          this._accountService.createAccount(account).subscribe(
            (response) => {
              this.getAccounts()
                .then(() => {
                  this.expandAccounts(response);
                  this.selectAccount(response);
                  this.noShowFormAddNewClass();
                  this.noAddNewChild();
                  Swal.fire({
                    title: 'Creación exitosa!',
                    showConfirmButton: false,
                    icon: 'success',
                    timer: 1000
                  });
                });
            },
            (error) => {
              Swal.fire({
                title: 'Error!',
                text: 'Ha ocurrido un error al crear la cuenta!.',
                confirmButtonColor: buttonColors.confirmationColor,
                icon: 'error',
              });
              console.log(error);
            }
          );
        }
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Ya existe una cuenta con el código ingresado!',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Error al guardar el tipo de cuenta:', error);
    }
  }

  /**
   * Delete an account by calling the service
   */
  deleteAccount() {
    try {
      Swal.fire({
        title: '¿Estás seguro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: buttonColors.confirmationColor,
        cancelButtonColor: buttonColors.cancelButtonColor,
        confirmButtonText: 'Sí, Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.accountSelected && this.accountSelected.id) {
            this._accountService.deleteAccount(this.accountSelected?.id.toString()).subscribe(
              (response) => {
                Swal.fire({
                  title: 'Eliminación exitosa!',
                  showConfirmButton: false,
                  confirmButtonColor: buttonColors.confirmationColor,
                  icon: 'success',
                  timer: 1000
                });
                this.getAccounts()
                  .then(() => {
                    if (this.accountSelected && this.accountSelected.parent) {
                      this._accountService.getAccountByCode(this.accountSelected?.parent, this.getIdEnterprise()).subscribe({
                        next: (account) => {
                          this.expandAccounts(account);
                          this.selectAccount(account);
                          this.noShowFormAddNewClass();
                          this.noAddNewChild();
                        }
                      });
                    } else {
                      this.noShowPrincipalAndTransactionalForm();
                    }
                  });
              },
              (error) => {
                Swal.fire({
                  title: 'Error!',
                  text: 'Ha ocurrido un error al eliminar la cuenta!.',
                  confirmButtonColor: buttonColors.confirmationColor,
                  icon: 'error',
                });
              }
            );
          }
        }
      });
    } catch (error) {
      console.error('Error al eliminar el tipo de cuenta:', error);
    }
  }

  /**
   * Update an account 
   */
  async updateAccount() {
    try {
      if (this.accountSelected) {
        if (this.accountSelected && this.accountSelected.children && this.accountSelected.children.length > 0 && this.accountSelected.code != this.parentId + this.accountForm.get(this.code)?.value) {
          Swal.fire({
            title: 'Error!',
            text: 'No se puede actualizar el código de una cuenta que tenga subcuentas!',
            confirmButtonColor: buttonColors.confirmationColor,
            icon: 'error',
          });
          this.selectAccount(this.accountSelected);
        } else {
          const account: Account = {
            code: this.parentId + this.accountForm.get(this.code)?.value,
            description: this.accountForm.get(this.name)?.value,
            nature: this.formTransactional.value.selectedNatureType,
            financialStatus: this.formTransactional.value.selectedFinancialStateType,
            classification: this.formTransactional.value.selectedClasificationType,
          }
          const accountExist = await this.getAccountByCode(account);

          if (!accountExist) {
            this.update(this.accountSelected?.id, account);
          } else {
            if (this.accountSelected.code === account.code && (this.accountSelected.description != account.description || account.nature != this.accountSelected.nature || account.financialStatus != this.accountSelected.financialStatus || account.classification != this.accountSelected.classification)) {
              this.update(this.accountSelected?.id, account);
            } else {
              if (this.accountSelected.code === account.code && this.accountSelected.description == account.description) {
                Swal.fire({
                  title: 'Error!',
                  text: 'La cuenta tiene la misma información!',
                  confirmButtonColor: buttonColors.confirmationColor,
                  icon: 'error',
                });
              } else {
                Swal.fire({
                  title: 'Error!',
                  text: 'Ya existe una cuenta con el código ingresado!',
                  confirmButtonColor: buttonColors.confirmationColor,
                  icon: 'error',
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error al actualizar la cuenta:', error);
    }
  }

  /**
   * Update an account by calling the service
   * @param id ID of the account to update
   * @param account account that contains the information to update
   */
  update(id?: number, account?: Account) {
    this._accountService.updateAccount(id, account).subscribe(
      (response) => {
        this.getAccounts()
          .then(() => {
            this.expandAccounts(response);
            this.selectAccount(response);
            this.noShowFormAddNewClass();
            this.noAddNewChild();
            Swal.fire({
              title: 'Actualización exitosa!',
              showConfirmButton: false,
              icon: 'success',
              confirmButtonColor: buttonColors.confirmationColor,
              timer: 1000
            });
          });
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Ha ocurrido un error al actualizar la cuenta!.',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
        console.error('Error al actualizar la cuenta:', error);
      }
    );
  }

  /**
   * Expands the parent accounts of the selected account
   * @param account Account to expand
   * @returns A Promise that resolves to void
   */
  expandAccounts(account: Account): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const code = account.code;

        const stack: Account[] = [...this.listAccounts];

        while (stack.length > 0) {
          const currentAccount = stack.pop();

          if (!currentAccount) continue;

          if (currentAccount.code === code.slice(0, currentAccount.code.length)) {
            currentAccount.showSubAccounts = true;

            if (currentAccount.code.length < code.length) {
              const nextCodeSegment = code.slice(0, currentAccount.code.length + 2);
              if (currentAccount.children) {
                for (let child of currentAccount.children) {
                  if (child.code === nextCodeSegment) {
                    stack.push(child);
                    break;
                  }
                }
              }
            }
          }

          if (currentAccount.children) {
            stack.push(...currentAccount.children);
          }
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
