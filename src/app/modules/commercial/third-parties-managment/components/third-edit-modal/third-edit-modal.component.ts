import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThirdServiceService } from '../../services/third-service.service';
import { Third } from '../../models/Third';
import { eTypeId } from '../../models/eTypeId';
import { ePersonType } from '../../models/ePersonType';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-third-edit-modal',
  templateUrl: './third-edit-modal.component.html',
  styleUrl: './third-edit-modal.component.css'
})
export class ThirdEditModalComponent {

  inputData: any;
  thirdData: Third = {
    thId: 0,
    entId: '',
    typeId: eTypeId.cc,  // Utiliza uno de los valores definidos en el enum
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
    country: '',
    province: '',
    city: '',
    address: '',
    phoneNumber: '',
    email: '',
    creationDate: '',
    updateDate: ''
  };
  thirdForm: FormGroup = this.fb.group({
    typeId: [this.thirdData.typeId],
    idNumber: [this.thirdData.idNumber],
    personType: [this.thirdData.personType],
    thirdTypes: [this.thirdData.thirdTypes],
    names: [this.thirdData.names],
    lastNames: [this.thirdData.lastNames],
    socialReason: [this.thirdData.socialReason],
    verificationNumber: [this.thirdData.verificationNumber],
    gender: [this.thirdData.gender],
    country: [this.thirdData.country],
    province: [this.thirdData.province],
    city: [this.thirdData.city],
    address: [this.thirdData.address],
    phoneNumber: [this.thirdData.phoneNumber],
    email: [this.thirdData.email]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private ref:MatDialogRef<ThirdEditModalComponent>, private service:ThirdServiceService, private fb:FormBuilder){

  }

  ngOnInit(){
    this.inputData = this.data;
    if(this.inputData.thId > 0){
      this.service.getThirdPartie(this.inputData.thId).subscribe(third => {
        this.thirdData = third;
        this.thirdForm = this.fb.group({
          typeId: [this.thirdData.typeId],
          idNumber: [this.thirdData.idNumber],
          personType: [this.thirdData.personType],
          thirdTypes: [this.thirdData.thirdTypes],
          names: [this.thirdData.names],
          lastNames: [this.thirdData.lastNames],
          socialReason: [this.thirdData.socialReason],
          verificationNumber: [this.thirdData.verificationNumber],
          gender: [this.thirdData.gender],
          country: [this.thirdData.country],
          province: [this.thirdData.province],
          city: [this.thirdData.city],
          address: [this.thirdData.address],
          phoneNumber: [this.thirdData.phoneNumber],
          email: [this.thirdData.email]
        });
      })
    }
  }

  closePopUp(){
    this.ref.close('closing from modal details');
  }
}
