import { Component } from '@angular/core';
import { Account } from '../../models/ChartAccount';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrl: './accounts-list.component.css'
})
export class AccountsListComponent {

  constructor() { }

  ngOnInit(): void {
    this.listAccounts
  }

  listAccounts: Account[] = [
    {
      code: '1',
      name: 'Activos',
      subAccounts: [
        {
          code: '1.1',
          name: 'Activos corrientes',
          subAccounts: [
            {
              code: '1.1.1',
              name: 'Efectivo y equivalentes de efectivo',
              subAccounts: [
                {
                  code: '1.1.1.1',
                  name: 'Caja general',
                  subAccounts: [
                    {
                      code: '1.1.1.1.1',
                      name: 'Caja principal',
                      subAccounts: [
                        { code: '1.1.1.1.1.1', name: 'Caja chica 1' },
                        { code: '1.1.1.1.1.2', name: 'Caja chica 2' }
                      ]
                    },
                    { code: '1.1.1.1.2', name: 'Caja chica' }
                  ]
                },
                { code: '1.1.1.2', name: 'Bancos' }
              ]
            },
            { code: '1.1.2', name: 'Cuentas por cobrar' }
          ]
        },
        {
          code: '1.2',
          name: 'Activos no corrientes',
          subAccounts: [
            { code: '1.2.1', name: 'Propiedades, planta y equipo' },
            { code: '1.2.2', name: 'Activos intangibles' }
          ]
        }
      ]
    },
    {
      code: '2',
      name: 'Pasivos',
      subAccounts: [
        {
          code: '2.1',
          name: 'Pasivos corrientes',
          subAccounts: [
            { code: '2.1.1', name: 'Cuentas por pagar' },
            { code: '2.1.2', name: 'Obligaciones financieras corrientes' }
          ]
        },
        {
          code: '2.2',
          name: 'Pasivos no corrientes',
          subAccounts: [
            { code: '2.2.1', name: 'Obligaciones financieras no corrientes' },
            { code: '2.2.2', name: 'Beneficios a empleados a largo plazo' }
          ]
        }
      ]
    },
    {
      code: '3',
      name: 'Patrimonio neto',
      subAccounts: [
        { code: '3.1', name: 'Capital social' },
        { code: '3.2', name: 'Utilidades acumuladas' }
      ]
    }
  ];
  


  toggleSubAccounts(account: Account) {
    account.showSubAccounts = !account.showSubAccounts;
  }
}
