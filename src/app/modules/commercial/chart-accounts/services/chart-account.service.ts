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
  private apiURL = environment.myAppUrl + 'accountCatalogue'
  constructor(private http:HttpClient) {
    
   }

  getListAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>('http://contables.unicauca.edu.co/api/accountCatalogue/trees');
  }

  /////////////

  listAccounts: Account[] = [
        {
        code: '1',
        description: 'Activos',
        nature: 'Débito',
        financialStatus: 'Estado de Situación Financiero',
        classification: 'Activo Corriente',
        children: [
            {
            code: '11',
            description: 'Activos corrientes',
            nature: 'Crédito',
            financialStatus: 'Estado de Resultados',
            classification: 'Patrimonio',
            children: [
                {
                code: '1105',
                description: 'Efectivo y equivalentes de efectivo',
                nature: '',
                financialStatus: '',
                classification: '',
                children: [
                    {
                    code: '110501',
                    description: 'Caja general',
                    nature: '',
                    financialStatus: '',
                    classification: '',
                    children: [
                        {
                            code: '11050101',
                            description: 'Caja principal',
                            nature: '',
                            financialStatus: '',
                            classification: '',
                        },
                        { 
                            code: '11050102', 
                            description: 'Caja chica',
                            nature: '',
                            financialStatus: '',
                            classification: ''
                        }
                    ]
                    },
                    { 
                        code: '110502', 
                        description: 'Bancos' ,
                        nature: '',
                        financialStatus: '',
                        classification: ''
                    }
                ]
                },
                { 
                    code: '1106', 
                    description: 'Cuentas por cobrar', 
                    nature: '',
                    financialStatus: '',
                    classification: '',
                    children: [] 
                }
            ]
            },
            {
            code: '12',
            description: 'Activos no corrientes',
            nature: '',
            financialStatus: '',
            classification: '',
            children: [
                { 
                    code: '1205', 
                    description: 'Propiedades, planta y equipo',
                    nature: '',
                    financialStatus: '',
                    classification: '', 
                    children: [] 
                },
                { 
                    code: '1206', 
                    description: 'Activos intangibles', 
                    nature: '',
                    financialStatus: '',
                    classification: '',
                    children: [] 
                }
            ]
            }
        ]
        },
        {
        code: '2',
        description: 'Pasivos',
        nature: 'Crédito',
        financialStatus: 'Estado de Resultados',
        classification: 'Pasivo Corriente',
        children: [
            {
            code: '21',
            description: 'Pasivos corrientes',
            nature: '',
            financialStatus: '',
            classification: '',
            children: [
                { 
                    code: '2105', 
                    description: 'Cuentas por pagar', 
                    nature: '',
                    financialStatus: '',
                    classification: '',
                    children: [] 
                },
                { 
                    code: '2106', 
                    description: 'Obligaciones financieras corrientes', 
                    nature: '',
                    financialStatus: '',
                    classification: '',
                    children: [] 
                }
            ]
            },
            {
            code: '22',
            description: 'Pasivos no corrientes',
            nature: '',
            financialStatus: '',
            classification: '',
            children: [
                { 
                    code: '2205', 
                    description: 'Obligaciones financieras no corrientes',
                    nature: '',
                    financialStatus: '',
                    classification: '', 
                    children: [] 
                },
                { 
                    code: '2206', 
                    description: 'Beneficios a empleados a largo plazo', 
                    nature: '',
                    financialStatus: '',
                    classification: '',
                    children: [] 
                }
            ]
            }
        ]
        },
        {
        code: '3',
        description: 'Patrimonio',
        nature: '',
        financialStatus: '',
        classification: '',
        children: [
            { 
                code: '31', 
                description: 'Capital social', 
                nature: '',
                financialStatus: '',
                classification: '',
                children: [] 
            },
            { 
                code: '32', 
                description: 'Utilidades acumuladas', 
                nature: '',
                financialStatus: '',
                classification: '',
                children: [] 
            }
        ]
        },
        {
        code: '4',
        description: 'Ingresos',
        nature: '',
        financialStatus: '',
        classification: '',
        children: []
        },
        {
        code: '5',
        description: 'Gastos',
        nature: '',
        financialStatus: '',
        classification: '',
        children: [
            { 
                code: '51', 
                description: 'De Administración', 
                nature: '',
                financialStatus: '',
                classification: '',
                children: [] 
            },
            { 
                code: '52', 
                description: 'De Operación', 
                nature: '',
                financialStatus: '',
                classification: '',
                children: [] 
            }
        ]
        },
        {
        code: '6',
        description: 'Costos de venta y operación',
        nature: 'Débito',
        financialStatus: 'Estado de Situación Financiero',
        classification: 'Activo No Corriente',
        children: []
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

    saveAccountsImport(accounts:Account[]): boolean{
        this.listAccounts = accounts;
        //TODO: ver la confirmacion desde el backend de que se guardo las cuentas importadas
        return true;
    }

}
