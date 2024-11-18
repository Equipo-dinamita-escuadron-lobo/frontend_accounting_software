import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ThirdServiceService } from '../../services/third-service.service';
import { Third } from '../../models/Third';
// Definir el tipo de archivo y la extensión
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Component({
  selector: 'app-third-export',
  templateUrl: './third-export.component.html',
  styleUrls: ['./third-export.component.css']
})
export class ThirdExportComponent {
  private listThirds: Third[] = [];
  constructor(private thirdService: ThirdServiceService) { }
  /**
 * Download the Excel file with the accounts
 */
  downloadExcel() {
    // Definir las columnas del archivo Excel
    const data: any[] = [
      ['Tipo persona',
        'Tipos de tercero',
        'Nombres',
        'Apellidos',
        'Razon social',
        'Genero',
        'Tipo ID',
        'Identificacion',
        'Numero de verificacion',
        'Estado',
        'Pais',
        'Departamento',
        'Ciudad',
        'Direccion',
        'Telefono',
        'Correo']
    ];
    // Recorrer todas las cuentas y sus sub-cuentas
    this.listThirds.forEach(account => {
      this.addThirdToExcel(data, account);
    });
    // Crear una hoja de trabajo (worksheet) con los datos
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    // Ajustar el tamaño de las columnas
    worksheet['!cols'] = [
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
    ];
    // Crear un libro de trabajo (workbook)
    const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };
    // Generar el archivo Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // Guardar el archivo
    this.saveAsExcelFile(excelBuffer, 'Terceros');
  }
  /**
   * Function recurive to add accounts to the Excel file
   * @param data 
   * @param account 
   * @param level 
   */
  addThirdToExcel(data: any[], third: Third, level: number = 0): void {
    // Combinar varios valores de `thirdTypes` en una cadena, si es un array
    const thirdTypes = Array.isArray(third.thirdTypes)
        ? [...new Set(third.thirdTypes.map(type => type.thirdTypeName))].join(', ')
        : third.thirdTypes;
    const thirdThipeId = third.typeId.typeId;
        
    // Convertir el estado booleano a "Activo" o "Inactivo"
    const state = third.state ? 'Activo' : 'Inactivo';
    // Agregar el tercero actual como una nueva fila en el Excel
    data.push([
      third.personType,
      thirdTypes,
      third.names || '',
      third.lastNames || '',
      third.socialReason || '',
      third.gender || '',
      thirdThipeId,
      third.idNumber,
      third.verificationNumber || '',
      state,
      third.country,
      third.province,
      third.city,
      third.address,
      third.phoneNumber,
      third.email,
    ]);
  }
  /**
   * Save to Excel file
   * @param buffer
   * @param fileName
   * @returns void
   *  */
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + EXCEL_EXTENSION);
  }
  getIdEnterprise(): string {
    const entData = localStorage.getItem('entData');
    return entData ? JSON.parse(entData).entId : '';
  }
  /**
   * Get thirds from the API and download the Excel file
   * @returns Promise<boolean>
   */
  getThirds(): Promise<boolean> {
    console.log('paso 2')
    return new Promise((resolve) => {
      this.thirdService.getThirdParties(this.getIdEnterprise(), 0).subscribe({
        next: (thirds) => {
          // Validar que se obtuvieron terceros válidos
          if (thirds && thirds.length > 0) {
            this.listThirds = thirds.filter(third => third !== null);
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