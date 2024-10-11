import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThirdServiceService } from '../../services/third-service.service';
import { Third } from '../../models/Third';
import { TypeId } from '../../models/TypeId';
import { ePersonType } from '../../models/ePersonType';

@Component({
  selector: 'app-third-details-modal',
  templateUrl: './third-details-modal.component.html',
  styleUrl: './third-details-modal.component.css'
})
export class ThirdDetailsModalComponent {

  inputData: any;
  thirdData: Third = {
    thId: 0,
    entId: '',
    typeId: { 
      entId: "0",
      typeId: "CC",
      typeIdname: "CC"
    },  // Utiliza uno de los valores definidos en el enum
    thirdTypes: [],       // Array vacío o podrías iniciar con valores predeterminados si aplica
    rutPath: undefined,
    personType: ePersonType.natural,
    names: undefined,
    lastNames: undefined,
    socialReason: undefined,
    gender: undefined,
    idNumber: 0,
    verificationNumber: undefined,
    state: false,
    photoPath: undefined,
    country: 'SV',
    province: 'AH',
    city: 'Atiquizaya',
    address: 'Calle Principal',
    phoneNumber: '1234567890',
    email: 'email@example.com',
    creationDate: '2024-04-27',
    updateDate: '2024-04-29'
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private ref:MatDialogRef<ThirdDetailsModalComponent>, private service:ThirdServiceService){

  }

  closePopUp(){
    this.ref.close('closing from modal details');
  }

  ngOnInit(){
    this.inputData = this.data;
    if(this.inputData.thId > 0){
      this.service.getThirdPartie(this.inputData.thId).subscribe(third => {
        this.thirdData = third;
      })
    }
  }
}
