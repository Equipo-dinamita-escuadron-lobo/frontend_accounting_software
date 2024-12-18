import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ChartAccountService } from '../../services/chart-account.service';
import { Account } from '../../models/ChartAccount';

// Definir el tipo de archivo y la extensión
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-account-export',
  templateUrl: './account-export.component.html',
  styleUrls: ['./account-export.component.css']
})
export class AccountExportComponent {
  private listAccounts: Account[] = [];

  constructor(private _accountService: ChartAccountService) { }



  /**
   * Genera y descarga un archivo Excel con los datos de las cuentas.
   */
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

    // Ajustar el tamaño de las columnas
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 30 },
      { wch: 20 },
      { wch: 30 },
      { wch: 25 },
    ];

    // Crear un libro de trabajo (workbook)
    const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };

    // Generar el archivo Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Guardar el archivo
    this.saveAsExcelFile(excelBuffer, 'CatalogoCuentas');
  }



  /**
   * Función recursiva para agregar cuentas al archivo Excel.
   * @param data Arreglo que contiene los datos del archivo Excel.
   * @param account Objeto que representa la cuenta a agregar.
   * @param level Nivel de profundidad o indentación de la cuenta en la jerarquía (por defecto es 0).
   */

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

  /**
   * Guarda el archivo en formato Excel.
   * @param buffer Datos binarios del archivo Excel.
   * @param fileName Nombre del archivo sin extensión.
   * @returns void
   */
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + EXCEL_EXTENSION);
  }


  /**
 * Obtiene el ID de la empresa desde el almacenamiento local.
 * @returns El ID de la empresa como cadena de texto. Devuelve una cadena vacía si no se encuentra.
 */
  getIdEnterprise(): string {
    const entData = localStorage.getItem('entData');
    return entData ? JSON.parse(entData).entId : '';
  }

  /**
   * Obtiene las cuentas desde la API y descarga el archivo Excel con los datos.
   * @returns Promesa que resuelve en true si se descargó el Excel, o false si ocurrió un error o no se encontraron cuentas válidas.
   */

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
            //console.error('No se encontraron cuentas válidas.');
            resolve(false); // Retorna false si no se encontraron cuentas válidas
          }
        },
        error: (error) => {
          //console.error('Error al obtener cuentas', error);
          resolve(false); // Retorna false en caso de error
        }
      });
    });
  }

}


