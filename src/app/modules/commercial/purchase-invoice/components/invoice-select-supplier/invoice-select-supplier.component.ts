import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Third } from '../../../third-parties-managment/models/Third';
import { ThirdServiceService } from '../../../third-parties-managment/services/third-service.service';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { ePersonType } from '../../../third-parties-managment/models/ePersonType';
import { eThirdGender } from '../../../third-parties-managment/models/eThirdGender';

@Component({
  selector: 'app-invoice-select-supplier',
  templateUrl: './invoice-select-supplier.component.html',
  styleUrl: './invoice-select-supplier.component.css'
})
export class InvoiceSelectSupplierComponent {
  inputData: any;

  lstThirds: Third[] = [
    {
      thId: 1,
      entId: 'ENT001',
      typeId: {
        entId: "123",
        typeId: "asffsd",
        typeIdname: "123123"
      },
      thirdTypes: [],
      personType: ePersonType.natural,
      names: 'John',
      lastNames: 'Doe',
      socialReason: 'JD Enterprises',
      gender: eThirdGender.masculino,
      idNumber: 123456789,
      state: true,
      country: 'USA',
      province: 'California',
      city: 'Los Angeles',
      address: '123 Main St',
      phoneNumber: '+1234567890',
      email: 'john.doe@example.com',
      creationDate: new Date().toISOString(),
      updateDate: new Date().toISOString()
    }
  ];


  entData : any | any = null;
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();

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
    //Se obtiene datos de empresa seleccionada 
    /*this.entData = this.localStorageMethods.loadEnterpriseData();

    //Se obtienen los teceros de la mepresa en especifico
    if(this.entData){
      this.thirdService.getThirdParties(this.entData.entId, 0).subscribe({
        next: (response: Third[])=>{
          this.lstThirds = response;
        }
      })
    }*/
  }

  closePopUp() {
    this.ref.close('closing from modal details');
  }
}
