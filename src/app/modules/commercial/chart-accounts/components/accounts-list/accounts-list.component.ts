import { Component } from '@angular/core';
import { Account } from '../../models/ChartAccount';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrl: './accounts-list.component.css'
})
export class AccountsListComponent {
  filterAccount:string = '';

  constructor() { }

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
              code: '111',
              name: 'Efectivo y equivalentes de efectivo',
              subAccounts: [
                {
                  code: '1111',
                  name: 'Caja general',
                  subAccounts: [
                    {
                      code: '11111',
                      name: 'Caja principal',
                      subAccounts: [
                        { code: '111111', name: 'Caja chica 1' },
                        { code: '111112', name: 'Caja chica 2' }
                      ]
                    },
                    { code: '11112', name: 'Caja chica' }
                  ]
                },
                { code: '1112', name: 'Bancos' }
              ]
            },
            { code: '112', name: 'Cuentas por cobrar' }
          ]
        },
        {
          code: '12',
          name: 'Activos no corrientes',
          subAccounts: [
            { code: '121', name: 'Propiedades, planta y equipo' },
            { code: '122', name: 'Activos intangibles' }
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
            { code: '211', name: 'Cuentas por pagar' },
            { code: '212', name: 'Obligaciones financieras corrientes' }
          ]
        },
        {
          code: '22',
          name: 'Pasivos no corrientes',
          subAccounts: [
            { code: '221', name: 'Obligaciones financieras no corrientes' },
            { code: '222', name: 'Beneficios a empleados a largo plazo' }
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
}
