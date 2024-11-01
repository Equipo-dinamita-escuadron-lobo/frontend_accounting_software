import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ThirdType } from '../../../third-parties-managment/models/ThirdType';
import { ThirdServiceService } from '../../../third-parties-managment/services/third-service.service';

@Component({
  selector: 'app-invoice-select-supplier',
  templateUrl: './invoice-select-supplier.component.html',
  styleUrl: './invoice-select-supplier.component.css'
})
export class InvoiceSelectSupplierComponent {
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<InvoiceSelectSupplierComponent>, private thirdService: ThirdServiceService){

  }

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
            title: 'Error!',
            text: 'No se han encontrado terceros para esta empresa!',
            icon: 'error',
          });
        }
      });
    }

  }

  selectItem(selectedValue: string): void {
    this.selectedItem = selectedValue;
    console.log('Item seleccionado:', this.selectedItem);
    this.ref.close(this.selectedItem);
  }

  closePopUp() {
    this.ref.close();
  }
}
