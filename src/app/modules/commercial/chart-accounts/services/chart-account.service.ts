import { Injectable } from '@angular/core';
//import { environment } from '../../../../../environments/environment';
import { environment } from '../../../../../environments/enviorment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/ChartAccount';
import { ClasificationType } from '../models/ClasificationType';
import { FinancialStateType } from '../models/FinancialStateType';
import { NatureType } from '../models/NatureType';

@Injectable({
  providedIn: 'root'
})
export class ChartAccountService {

  //private apiURL = environment.API_URL + 'chart-account'
  private apiURL = environment.myAppUrl + 'chart-account'
  constructor(private http:HttpClient) {
    
   }

  getListAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiURL);
  }



  /////////////

  listAccounts: Account[] = [
        {
        code: '1',
        name: 'Activos',
        nature: 'Débito',
        financialState: 'Estado de Situación Financiero',
        clasification: 'Activo Corriente',
        subAccounts: [
            {
            code: '11',
            name: 'Activos corrientes',
            nature: 'Crédito',
            financialState: 'Estado de Resultados',
            clasification: 'Patrimonio',
            subAccounts: [
                {
                code: '1105',
                name: 'Efectivo y equivalentes de efectivo',
                nature: '',
                financialState: '',
                clasification: '',
                subAccounts: [
                    {
                    code: '110501',
                    name: 'Caja general',
                    nature: '',
                    financialState: '',
                    clasification: '',
                    subAccounts: [
                        {
                            code: '11050101',
                            name: 'Caja principal',
                            nature: '',
                            financialState: '',
                            clasification: '',
                        },
                        { 
                            code: '11050102', 
                            name: 'Caja chica',
                            nature: '',
                            financialState: '',
                            clasification: ''
                        }
                    ]
                    },
                    { 
                        code: '110502', 
                        name: 'Bancos' ,
                        nature: '',
                        financialState: '',
                        clasification: ''
                    }
                ]
                },
                { 
                    code: '1106', 
                    name: 'Cuentas por cobrar', 
                    nature: '',
                    financialState: '',
                    clasification: '',
                    subAccounts: [] 
                }
            ]
            },
            {
            code: '12',
            name: 'Activos no corrientes',
            nature: '',
            financialState: '',
            clasification: '',
            subAccounts: [
                { 
                    code: '1205', 
                    name: 'Propiedades, planta y equipo',
                    nature: '',
                    financialState: '',
                    clasification: '', 
                    subAccounts: [] 
                },
                { 
                    code: '1206', 
                    name: 'Activos intangibles', 
                    nature: '',
                    financialState: '',
                    clasification: '',
                    subAccounts: [] 
                }
            ]
            }
        ]
        },
        {
        code: '2',
        name: 'Pasivos',
        nature: 'Crédito',
        financialState: 'Estado de Resultados',
        clasification: 'Pasivo Corriente',
        subAccounts: [
            {
            code: '21',
            name: 'Pasivos corrientes',
            nature: '',
            financialState: '',
            clasification: '',
            subAccounts: [
                { 
                    code: '2105', 
                    name: 'Cuentas por pagar', 
                    nature: '',
                    financialState: '',
                    clasification: '',
                    subAccounts: [] 
                },
                { 
                    code: '2106', 
                    name: 'Obligaciones financieras corrientes', 
                    nature: '',
                    financialState: '',
                    clasification: '',
                    subAccounts: [] 
                }
            ]
            },
            {
            code: '22',
            name: 'Pasivos no corrientes',
            nature: '',
            financialState: '',
            clasification: '',
            subAccounts: [
                { 
                    code: '2205', 
                    name: 'Obligaciones financieras no corrientes',
                    nature: '',
                    financialState: '',
                    clasification: '', 
                    subAccounts: [] 
                },
                { 
                    code: '2206', 
                    name: 'Beneficios a empleados a largo plazo', 
                    nature: '',
                    financialState: '',
                    clasification: '',
                    subAccounts: [] 
                }
            ]
            }
        ]
        },
        {
        code: '3',
        name: 'Patrimonio',
        nature: '',
        financialState: '',
        clasification: '',
        subAccounts: [
            { 
                code: '31', 
                name: 'Capital social', 
                nature: '',
                financialState: '',
                clasification: '',
                subAccounts: [] 
            },
            { 
                code: '32', 
                name: 'Utilidades acumuladas', 
                nature: '',
                financialState: '',
                clasification: '',
                subAccounts: [] 
            }
        ]
        },
        {
        code: '4',
        name: 'Ingresos',
        nature: '',
        financialState: '',
        clasification: '',
        subAccounts: []
        },
        {
        code: '5',
        name: 'Gastos',
        nature: '',
        financialState: '',
        clasification: '',
        subAccounts: [
            { 
                code: '51', 
                name: 'De Administración', 
                nature: '',
                financialState: '',
                clasification: '',
                subAccounts: [] 
            },
            { 
                code: '52', 
                name: 'De Operación', 
                nature: '',
                financialState: '',
                clasification: '',
                subAccounts: [] 
            }
        ]
        },
        {
        code: '6',
        name: 'Costos de venta y operación',
        nature: 'Débito',
        financialState: 'Estado de Situación Financiero',
        clasification: 'Activo No Corriente',
        subAccounts: []
        }
    ];


    listNature: NatureType[] = [
        {id: 1, name: 'Débito'},
        {id: 2, name: 'Crédito'}
    ];

    listFinancialState: FinancialStateType[] = [
        {id: 1, name: 'Estado de Situación Financiero'},
        {id: 2, name: 'Estado de Resultados'}
    ];

    listClasification: ClasificationType[] = [
        {id: 1, name: 'Activo Corriente'},
        {id: 2, name: 'Activo No Corriente'},
        {id: 3, name: 'Pasivo Corriente'},
        {id: 4, name: 'Pasivo No Corriente'},
        {id: 5, name: 'Patrimonio'},
        {id: 6, name: 'Ingresos Operacionales'},
        {id: 7, name: 'Ingresos No Operacionales'},
        {id: 8, name: 'Gastos Operacionales'},
        {id: 9, name: 'Ingresos Operacionales'}   
    ];

    getAccounts(): Account[] {
        return this.listAccounts;
    }

    getClasificationType(): ClasificationType[] {
        return this.listClasification;
    }

    getNatureType(): NatureType[] {
        return this.listNature;
    } 

    getFinancialStateType(): FinancialStateType[] {
        return this.listFinancialState;
    }

}
