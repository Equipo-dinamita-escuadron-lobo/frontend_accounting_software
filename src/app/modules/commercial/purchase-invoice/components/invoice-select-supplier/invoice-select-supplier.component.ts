import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ThirdType } from '../../../third-parties-managment/models/ThirdType';
import { ThirdServiceService } from '../../../third-parties-managment/services/third-service.service';
import { buttonColors } from '../../../../../shared/buttonColors';
/**
 * Componente para seleccionar un proveedor
 */
@Component({
  selector: 'app-invoice-select-supplier',
  templateUrl: './invoice-select-supplier.component.html',
  styleUrl: './invoice-select-supplier.component.css'
})
export class InvoiceSelectSupplierComponent {
  /**
   * Variables del componente
   */
  inputData: any; // Variable para almacenar los datos de entrada
  filterThird: string = '';   // Variable para almacenar el filtro de terceros
  lstThirds: any[] = [];  // Variable para almacenar los terceros
  selectedItem?: string;  // Variable para almacenar el item seleccionado
  entData : any | any = null; // Variable para almacenar los datos de la empresa

  columns: any[] = [
   { title: 'Nombre/RazonSocial', lstThirds: 'socialReason' },
   { title: 'Tipo Id', lstThirds: 'typeId' },
   { title: 'Número de Documento'},
   { title: 'Correo', lstThirds: 'email' },
   { title: 'Estado', lstThirds: 'state' },
   { title: 'Acciones'}
 ];

  /**
   * Constructor del componente
   * @param data 
   * @param ref 
   * @param thirdService
   */
  constructor(@Inject(MAT_DIALOG_DATA) 
    public data: any, 
    private ref: MatDialogRef<InvoiceSelectSupplierComponent>, 
    private thirdService: ThirdServiceService){
  }

  /**
   * Método para inicializar el componente
   */
  ngOnInit() {
    this.inputData = this.data;

    if (this.inputData.entId) {
      this.thirdService.getThirdParties(this.inputData.entId, 0).subscribe({
        next: (response: any[]) => {
          // Filtrar los terceros que tienen thirdTypes con thirdTypeName igual a "Proveedor"
          this.lstThirds = response.filter(third =>
            third.thirdTypes.some((type: ThirdType) => type.thirdTypeName === 'Proveedor'  || type.thirdTypeName === 'proveedor')
          );
        },
        error: (error) => {
          console.log(error);
          Swal.fire({
            title: 'Error',
            text: 'No se han encontrado terceros para esta empresa!',
            confirmButtonColor: buttonColors.confirmationColor,
            icon: 'error',
          });
        }
      });
    }

  }

  /**
   * Método para seleccionar un item
   * @param selectedValue
   * @memberof InvoiceSelectSupplierComponent
   * @description Método para seleccionar un item
   * @returns void
   */
  selectItem(selectedValue: string): void {
    this.selectedItem = selectedValue;
    console.log('Item seleccionado:', this.selectedItem);
    this.ref.close(this.selectedItem);
  }

  /**
   * Método para cerrar el popup
   */
  closePopUp() {
    this.ref.close();
  }
}