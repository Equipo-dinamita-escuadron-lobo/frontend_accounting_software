import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ChartAccountService } from '../../services/chart-account.service';
import { Account } from '../../models/ChartAccount';

@Component({
  selector: 'app-account-export',
  templateUrl: './account-export.component.html',
  styleUrls: ['./account-export.component.css']
})
export class AccountExportComponent {
  listAccounts: Account[] = [];

  constructor(private _accountService: ChartAccountService) {}

  // Función para descargar el archivo Excel
  downloadExcel() {
    // Definir las columnas del archivo Excel
    const data: any[] = [
      ['Código', 'Nombre', 'Naturaleza', 'Estado Financiero', 'Clasificación'],
    ];

    // Recorrer todas las cuentas y sus sub-cuentas
      this.listAccounts.forEach(account => {
      this.addAccountToExcel(data, account);
    });
    
    // Crear una hoja de trabajo (worksheet) con los datos
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    this.applyHeaderStyle(worksheet);

    // Ajustar el tamaño de las columnas
    worksheet['!cols'] = [
      { wch: 15 }, // Ancho de la primera columna ('Código')
      { wch: 30 }, // Ancho de la segunda columna ('Nombre')
      { wch: 20 }, // Ancho de la tercera columna ('Naturaleza')
      { wch: 30 }, // Ancho de la cuarta columna ('Estado Financiero')
      { wch: 25 }, // Ancho de la quinta columna ('Clasificación')
    ];

    // Crear un libro de trabajo (workbook)
    const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };

    // Generar el archivo Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Guardar el archivo
    this.saveAsExcelFile(excelBuffer, 'CatalogodeCuentas');
  }

  // Función para aplicar formato a los encabezados
  applyHeaderStyle(worksheet: XLSX.WorkSheet): void {
    const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || '');

    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col }); // Dirección de la celda (encabezado)
      const cell = worksheet[cellAddress];

      if (cell) {
        cell.s = {
          fill: {
            fgColor: { rgb: 'FFFF00' } // Color de fondo amarillo (hex: #FFFF00)
          },
          font: {
            bold: true // Texto en negrita
          }
        };
      }
    }
  }

  // Función recursiva para agregar cuentas y sub-cuentas a la data de Excel
  addAccountToExcel(data: any[], account: Account, level: number = 0): void {
    // Agregar la cuenta actual como una nueva fila en el Excel
    data.push([
      account.code,
      account.description,
      account.nature,
      account.financialStatus,
      account.classification
    ]);

    // Si la cuenta tiene sub-cuentas, recorrerlas recursivamente
    if (account.children && account.children.length > 0) {
      account.children.forEach(subAccount => {
        this.addAccountToExcel(data, subAccount, level + 1); // Incrementar el nivel de indentación para sub-cuentas
      });
    }
  }

  // Función para guardar el archivo Excel
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + EXCEL_EXTENSION);
  }

  getIdEnterprise(): string {
    const entData = localStorage.getItem('entData');
    return entData ? JSON.parse(entData).entId : '';
  }

  // Obtener las cuentas y descargar el archivo Excel cuando se haga clic en el botón
  getAccounts(): Promise<boolean> {
    return new Promise((resolve) => {
      this._accountService.getListAccounts(this.getIdEnterprise()).subscribe({
        next: (accounts) => {
          // Validar que se obtuvieron cuentas válidas
          if (accounts && accounts.length > 0) {
            this.listAccounts = accounts.filter(account => account !== null);
            this.downloadExcel(); // Descargar el Excel automáticamente
            resolve(true); // Retorna true si se descargó el Excel
          } else {
            console.error('No se encontraron cuentas válidas.');
            resolve(false); // Retorna false si no se encontraron cuentas válidas
          }
        },
        error: (error) => {
          console.error('Error al obtener cuentas', error);
          resolve(false); // Retorna false en caso de error
        }
      });
    });
  }
  
}

// Definir el tipo de archivo y la extensión
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
