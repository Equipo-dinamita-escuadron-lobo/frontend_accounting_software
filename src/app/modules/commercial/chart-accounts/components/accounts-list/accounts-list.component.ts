import { Component } from '@angular/core';
import { Account } from '../../models/ChartAccount';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrl: './accounts-list.component.css'
})
export class AccountsListComponent {
  filterAccount: string = '';
  listExcel: Account[] = [];
  listAccountsToShow: Account[] = [];

  //
  selectedAccount: Account | null = null;
  accountForm: FormGroup;
  //
  className = '';
  groupName = '';
  accountName = '';
  subAccountName = '';
  auxiliaryName = '';

  constructor(private fb: FormBuilder) {
    this.accountForm = this.fb.group({});
  }

  ngOnInit(): void {
  }

  listAccounts: Account[] = [
    {
      code: '1',
      name: 'Activos',
      subAccounts: [
        {
          code: '11',
          name: 'Activos corrientes',
          subAccounts: [
            {
              code: '1105',
              name: 'Efectivo y equivalentes de efectivo',
              subAccounts: [
                {
                  code: '110501',
                  name: 'Caja general',
                  subAccounts: [
                    { code: '11050101', name: 'Caja principal' },
                    { code: '11050102', name: 'Caja chica' }
                  ]
                },
                { code: '110502', name: 'Bancos' }
              ]
            },
            { code: '1106', name: 'Cuentas por cobrar' }
          ]
        },
        {
          code: '12',
          name: 'Activos no corrientes',
          subAccounts: [
            { code: '1205', name: 'Propiedades, planta y equipo' },
            { code: '1206', name: 'Activos intangibles' }
          ]
        }
      ]
    },
    {
      code: '2',
      name: 'Pasivos',
      subAccounts: [
        {
          code: '21',
          name: 'Pasivos corrientes',
          subAccounts: [
            { code: '2105', name: 'Cuentas por pagar' },
            { code: '2106', name: 'Obligaciones financieras corrientes' }
          ]
        },
        {
          code: '22',
          name: 'Pasivos no corrientes',
          subAccounts: [
            { code: '2205', name: 'Obligaciones financieras no corrientes' },
            { code: '2206', name: 'Beneficios a empleados a largo plazo' }
          ]
        }
      ]
    },
    {
      code: '3',
      name: 'Patrimonio neto',
      subAccounts: [
        { code: '31', name: 'Capital social' },
        { code: '32', name: 'Utilidades acumuladas' }
      ]
    }
  ];

  toggleSubAccounts(account: Account) {
    account.showSubAccounts = !account.showSubAccounts;
  }

  selectAccount(account: Account) {
    this.createForm(account);
  }
  createForm(selectedAccount: Account) {
    this.accountForm = this.fb.group({});

    this.assignName(selectedAccount.code, selectedAccount.name)
    this.accountForm.addControl('class', new FormControl(this.className));
    this.accountForm.addControl('classCode', new FormControl(selectedAccount.code.slice(0, 1)));

    if (selectedAccount.code.length >= 2) {
      this.accountForm.addControl('group', new FormControl(this.groupName));
      this.accountForm.addControl('groupCode', new FormControl(selectedAccount.code.slice(0, 2)));

      if (selectedAccount.code.length >= 4) {
        this.accountForm.addControl('account', new FormControl(this.accountName));
        this.accountForm.addControl('accountCode', new FormControl(selectedAccount.code.slice(0, 4)));
        this.accountForm.addControl('codeAccount', new FormControl(selectedAccount.code.slice(2, 4)));

        if (selectedAccount.code.length >= 6) {
          this.accountForm.addControl('subAccount', new FormControl(this.subAccountName));
          this.accountForm.addControl('subAccountCode', new FormControl(selectedAccount.code.slice(0, 6)));
          this.accountForm.addControl('codeSubAccount', new FormControl(selectedAccount.code.slice(4, 6)));

          if (selectedAccount.code.length >= 8) {
            this.accountForm.addControl('auxiliary', new FormControl(this.auxiliaryName));
            this.accountForm.addControl('auxiliaryCode', new FormControl(selectedAccount.code.slice(0, 8)));
            this.accountForm.addControl('codeAuxiliary', new FormControl(selectedAccount.code.slice(6, 8)));
          }
        }
      }
    }
  }

  assignName(code: string, name: string) {
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
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e) => {
      var workBook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetNames = workBook.SheetNames;
      let jsonData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);

      this.listExcel = jsonData.map((item: any) => ({
        code: item['Código'],
        name: item['Nombre'],
      }));
      console.log(this.createHierarchyWithParent(this.listExcel));
      this.listAccounts = this.createHierarchyWithParent(this.listExcel);
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
          hierarchy[parentCode] = { code: parentCode, name: '', subAccounts: [] };
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
  
}
