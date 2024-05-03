import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThirdServiceService } from '../../services/third-service.service';
import { Third } from '../../models/Third';
import { eTypeId } from '../../models/eTypeId';
import { ePersonType } from '../../models/ePersonType';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ThirdType } from '../../models/ThirdType';
import { TypeId } from '../../models/TypeId';
import { ThirdServiceConfigurationService } from '../../services/third-service-configuration.service';
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
@Component({
  selector: 'app-third-edit-modal',
  templateUrl: './third-edit-modal.component.html',
  styleUrl: './third-edit-modal.component.css'
})
export class ThirdEditModalComponent {

  inputData: any;
  thirdTypes: ThirdType[] = [];
  typeIds: TypeId[] = [];
  entData: any | null = null;
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  
  thirdData: Third = {
    thId: 0,
    entId: '',
    typeId:  { 
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

  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private ref:MatDialogRef<ThirdEditModalComponent>, private service:ThirdServiceService, private fb:FormBuilder,private thirdServiceConfiguration: ThirdServiceConfigurationService){

  }

  ngOnInit(){
    this.inputData = this.data;
    this.entData = this.localStorageMethods.loadEnterpriseData();
    if(this.inputData.thId > 0){
      this.service.getThirdPartie(this.inputData.thId).subscribe(third => {
        this.thirdData = third;
        this.thirdForm = this.fb.group({
          typeId: [this.thirdData.typeId.typeId],
          idNumber: [this.thirdData.idNumber],
          personType: [this.thirdData.personType],
          thirdTypes: [this.thirdData.thirdTypes[0].thirdTypeName],
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

    this.thirdServiceConfiguration.getThirdTypes(this.entData.entId).subscribe({
      next: (response: ThirdType[])=>{
        this.thirdTypes = response;
        console.log(response)
      },
      error: (error) => {
        console.log(error)
        
      }
    });
        
  this.thirdServiceConfiguration.getTypeIds(this.entData.entId).subscribe({
      next: (response: TypeId[])=>{
        this.typeIds = response;
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

  OnSubmit(){
    const currentDate = new Date();
    var third: Third = this.thirdForm.value;
    third.thId = this.thirdData.thId;
    third.entId = this.entData.entId;
    let typeIdValue = this.typeIds.find(typeId => typeId.typeIdname === this.thirdForm.get('typeId')?.value);
    let thirdTypeId = this.thirdTypes.find(thirdType=> thirdType.thirdTypeName === this.thirdForm.get("thirdTypes")?.value);
    if(typeIdValue !== null && typeIdValue !== undefined){
      third.typeId = typeIdValue;
    }
    if(thirdTypeId !== null && thirdTypeId !==undefined){
    third.thirdTypes = [thirdTypeId];
    console.log("Entro")
  }

  console.log(third);

  this.service.UpdateThird(third).subscribe({
    next: (response) => {
      // Handle the successful response here
      console.log('Success:', response);
      Swal.fire({
        title: 'Edicion exitosa!',
        text: 'Se ha creado el producto con éxito!',
        icon: 'success',
      });
    },
    error: (error) => {
      // Handle any errors here
      console.error('Error:', error);
      console.log(third);
      // Mensaje de éxito con alert
      Swal.fire({
        title: 'Error!',
        text: 'Ha Ocurrido Un Erro Al Editar El Tercero!',
        icon: 'error',
      });
    },
  });

  }

  closePopUp(){
    this.ref.close('closing from modal details');
  }
}
