import { Component, Inject, Type } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThirdServiceService } from '../../services/third-service.service';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import Swal from 'sweetalert2';
import { ThirdServiceConfigurationService } from '../../services/third-service-configuration.service';
import { ThirdType } from '../../models/ThirdType';
import { TypeId } from '../../models/TypeId';

@Component({
  selector: 'app-third-config-modal',
  templateUrl: './third-config-modal.component.html',
  styleUrl: './third-config-modal.component.css'
})
export class ThirdConfigModalComponent {
  inputData: any;

  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;
  showInputThirdType = false;
  showInputTypeId = false;
  newItemName = '';

  typesId: TypeId[] = []
  thirdTypes: ThirdType[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private ref:MatDialogRef<ThirdConfigModalComponent>, private service:ThirdServiceService, private thirdServiceConfiguration: ThirdServiceConfigurationService){

  }

  closePopUp(){
    this.ref.close('closing from modal details');
  }

  ngOnInit(){
    this.inputData = this.data;
    this.entData = this.localStorageMethods.loadEnterpriseData();
    this.thirdServiceConfiguration.getThirdTypes(this.entData.entId).subscribe({
      next: (response: ThirdType[])=>{
        this.thirdTypes = response;
      },
      error: (error) => {
        console.log(error)
        Swal.fire({
          title: 'Error!',
          text: 'No se han encontrado Tipos De Tercero Para esta Empresa',
          icon: 'error',
        });
      }
    });
        
  this.thirdServiceConfiguration.getTypeIds(this.entData.entId).subscribe({
      next: (response: TypeId[])=>{
        this.typesId = response;
        console.log(response)
      },
      error: (error) => {
        console.log(error)
        Swal.fire({
          title: 'Error!',
          text: 'No se han encontrado Tipos De Tercero Para esta Empresa',
          icon: 'error',
        });
      }
    });
  }

  addTypeId(items:any) {
    console.log(this.newItemName)
    let sendTypeId: TypeId = {
    entId: this.entData.entId,
    typeId: this.newItemName,
    typeIdname: this.newItemName};
    this.thirdServiceConfiguration.createTypeId(sendTypeId).subscribe({
      next: (response) => {
        // Handle the successful response here
        console.log('Success:', response);
      },
      error: (error) => {
        // Handle any errors here
        console.error('Error:', error);
        // Mensaje de éxito con alert
      },
    });

  }

  addThirdType(items:any) {
    console.log(this.newItemName)
    let sendTypeId: ThirdType = {
    entId: this.entData.entId,
    thirdTypeId: Math.floor(Math.random() * 1001),
    thirdTypeName: this.newItemName};
    console.log(sendTypeId)
    this.thirdServiceConfiguration.createThirdType(sendTypeId).subscribe({
      next: (response) => {
        // Handle the successful response here
        console.log('Success:', response);
      },
      error: (error) => {
        // Handle any errors here
        console.error('Error:', error);
        // Mensaje de éxito con alert
      },
    });

  }

  cancelAddThirdType() {
    this.newItemName = '';
    this.showInputThirdType = false;
  }

  cancelAddTypeId() {
    this.newItemName = '';
    this.showInputTypeId = false;
  }

  deleteItem(items: any, index: number) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No se podrá revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, elimínalo"
    }).then((result) => {
      if (result.isConfirmed) {
        items.splice(index, 1);
        Swal.fire({
          title: "Eliminado!",
          text: "Se eliminó con exito el tipo",
          icon: "success"
        });
      }
    });
  }
}
