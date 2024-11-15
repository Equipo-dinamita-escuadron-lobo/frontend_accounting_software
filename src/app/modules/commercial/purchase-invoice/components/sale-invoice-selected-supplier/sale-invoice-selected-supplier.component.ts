
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThirdServiceService } from '../../../third-parties-managment/services/third-service.service';
import Swal from 'sweetalert2';
import { ThirdType } from '../../../third-parties-managment/models/ThirdType';
import { buttonColors } from '../../../../../shared/buttonColors';

@Component({
  selector: 'app-sale-invoice-selected-supplier',
  templateUrl: './sale-invoice-selected-supplier.component.html',
  styleUrl: './sale-invoice-selected-supplier.component.css'
})



export class SaleInvoiceSelectedSupplierComponent {
  inputData: any;
  filterThird: string = '';
  lstThirds: any[] = [];
  selectedItem?: string;
  entData : any | any = null;

  columns: any[] = [
   { title: 'Nombre/RazonSocial', lstThirds: 'socialReason' },
   { title: 'Tipo Id', lstThirds: 'typeId' },
   { title: 'Número de Documento'},
   { title: 'Correo', lstThirds: 'email' },
   { title: 'Estado', lstThirds: 'state' },
   { title: 'Acciones'}
 ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<SaleInvoiceSelectedSupplierComponent>, private thirdService: ThirdServiceService){

  }

  ngOnInit() {
    this.inputData = this.data;

    if (this.inputData.entId) {
      this.thirdService.getThirdParties(this.inputData.entId, 0).subscribe({
        next: (response: any[]) => {
          // Filtrar los terceros que tienen thirdTypes con thirdTypeName igual a "Proveedor"
          this.lstThirds = response
          //console.log('Terceros:', this.lstThirds);
        },
        error: (error) => {
          //console.log(error);
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

  selectItem(selectedValue: string): void {
    this.selectedItem = selectedValue;
    //console.log('Item seleccionado:', this.selectedItem);
    this.ref.close(this.selectedItem);
  }

  closePopUp() {
    if(this.data.entId){
      this.ref.close();
    }
  }
}
