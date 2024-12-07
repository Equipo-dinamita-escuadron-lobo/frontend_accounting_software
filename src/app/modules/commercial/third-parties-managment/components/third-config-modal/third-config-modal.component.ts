import { Component, Inject, Type } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThirdServiceService } from '../../services/third-service.service';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import Swal from 'sweetalert2';
import { ThirdServiceConfigurationService } from '../../services/third-service-configuration.service';
import { ThirdType } from '../../models/ThirdType';
import { TypeId } from '../../models/TypeId';
import { buttonColors } from '../../../../../shared/buttonColors';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-third-config-modal',
  templateUrl: './third-config-modal.component.html',
  styleUrl: './third-config-modal.component.css'
})
export class ThirdConfigModalComponent {
  inputData: any;

  /*aquie empiezo */
  showIdentifications = true;

  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;
  showInputThirdType = false;
  showInputTypeId = false;
  newItemName = '';

  

  //Se agregaron 2 nuevas propiedades(newIdentificatioName newThirdTypeName) para evitar que se dupliquen los datos en los campos de Tipo de Identificacion y Tipo de Tercero
  newIdentificatioName = '';
  newThirdTypeName = '';

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
    this.thirdServiceConfiguration.getThirdTypes(this.entData).subscribe({
      next: (response: ThirdType[])=>{
        this.thirdTypes = response;
      },
      error: (error) => {
        console.log(error)
        Swal.fire({
          title: 'Error',
          text: 'No se han encontrado Tipos De Tercero Para esta Empresa',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
      }
    });

  this.thirdServiceConfiguration.getTypeIds(this.entData).subscribe({
      next: (response: TypeId[])=>{
        this.typesId = response;
        console.log(response)
      },
      error: (error) => {
        console.log(error)
        Swal.fire({
          title: 'Error',
          text: 'No se han encontrado Tipos De Tercero Para esta Empresa',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
      }
    });
  }

   //correccion HU-1.1
   //Al momento de crear un nuevo Tipo de identificacion se muestra un mensaje en pantalla
   //Se actualiza la tabla donde se muestran todos los tipos de identifiacion registrados en el sistema
  addTypeId(items:any) {
    console.log(this.newIdentificatioName)
    let sendTypeId: TypeId = {
    entId: this.entData,
    typeId: this.newIdentificatioName,
    typeIdname: this.newIdentificatioName};
    this.thirdServiceConfiguration.createTypeId(sendTypeId).subscribe({
      next: (response) => {
        this.typesId.push(response);
        this.newIdentificatioName = '';
        this.showInputTypeId = false;
        Swal.fire({
          title: 'Éxito',
          text: 'Tipo de identificación agregado con éxito',
          icon: "success",
          confirmButtonColor: buttonColors.confirmationColor
        });
      },
      error: (error) => {
        console.error('Error:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al agregar el Tipo de Identifiacion',
          icon: 'error',
          confirmButtonColor: buttonColors.confirmationColor
        });
      },
    });

  }


  //correccion HU-1.2
  //Al momento de crear un nuevo Tipo de Tercero se muestra un mensaje en pantalla
  //Se actualiza la tabla donde se muestran todos los tipos de Terceros registrados en el sistema
  addThirdType(items:any) {
    console.log(this.newThirdTypeName)
    let sendTypeId: ThirdType = {
    entId: this.entData,
    thirdTypeId: Math.floor(Math.random() * 1001),
    thirdTypeName: this.newThirdTypeName};
    console.log(sendTypeId)
    this.thirdServiceConfiguration.createThirdType(sendTypeId).subscribe({
      next: (response) => {
        this.thirdTypes.push(response);
        this.newThirdTypeName = '';
        this.showInputThirdType = false;
        Swal.fire({
          title: 'Éxito',
          text: 'Tipo de tercero agregado con exito',
          icon: "success",
          confirmButtonColor: buttonColors.confirmationColor
        });
      },
      error: (error) => {
        console.error('Error:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al agregar el Tipo de Tercero',
          icon: 'error',
          confirmButtonColor: buttonColors.confirmationColor
        });
      },
    });

  }

  cancelAddThirdType() {
    this.newThirdTypeName = '';
    this.showInputThirdType = false;
  }

  cancelAddTypeId() {
    this.newIdentificatioName = '';
    this.showInputTypeId = false;
  }

  deleteItem(items: any, index: number) {
    this.thirdServiceConfiguration.deleteThird(items[index].thirdTypeId).subscribe({
      next: (response) => {
      },
      error: (error: HttpErrorResponse) => {
        
        if (error.error.text === 'SUCCESS') {
          
          this.createAlert(items, index, "¿estás seguro?", "no se podra revertir este cambio",'success', true, "si, eliminalo")
          
        }
        else{
          this.createAlert(items, index, "No se pudo eliminar", "el valor esta asignado a un usuario",'error', false, undefined)
        }
      
      }
    });
  }
  deleteItemId(items: any, index: number) {
    this.thirdServiceConfiguration.deleteThird(items[index].thirdTypeId).subscribe({
      next: (response) => {
      },
      error: (error: HttpErrorResponse) => {
        
        if (error.error.text === 'SUCCESS') {
          
          this.createAlert(items, index, "¿estás seguro?", "no se podra revertir este cambio",'success', true, "si, eliminalo")
          
        }
        else{
          this.createAlert(items, index, "No se pudo eliminar", "el valor esta asignado a un usuario",'error', false, undefined)
        }
      
      }
    });
  }

  createAlert(items: any, index: number, title: string, text: string, icono: 'success' | 'error' | 'warning' | 'info' | 'question', confirmed: boolean, confirmButtonText: string| undefined ) {
    Swal.fire({
      title: title,
      text: text,
      icon: icono,
      showCancelButton: true,
      confirmButtonColor: buttonColors.confirmationColor,
      cancelButtonColor: buttonColors.cancelButtonColor,
      confirmButtonText: confirmed ? confirmButtonText : undefined,
      showConfirmButton: confirmed
    }).then((result) => {
      if (confirmed && result.isConfirmed) {
        items.splice(index, 1);
        Swal.fire({
          title: "Eliminado!",
          text: "Se eliminó con exito el tipo",
          confirmButtonColor: buttonColors.confirmationColor,
          icon: "success"
        });
      }
    });
  }  
  
}
