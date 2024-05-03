import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThirdServiceService } from '../../services/third-service.service';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import Swal from 'sweetalert2';

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

  typesId:any = [
    {
      typeId: 1,
      typeName: 'CC'
    },
    {
      typeId: 2,
      typeName: 'CE'
    },
    {
      typeId: 3,
      typeName: 'Pasaporte'
    },
    {
      typeId: 4,
      typeName: 'NIT'
    },
  ]
  thirdTypes:any = [
    {
      thirdTypeId: 1,
      typeName: 'Proveedor'
    },
    {
      thirdTypeId: 2,
      typeName: 'Cliente'
    },
    {
      thirdTypeId: 3,
      typeName: 'Empleado'
    },
    {
      thirdTypeId: 4,
      typeName: 'Otro'
    },
  ]

  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private ref:MatDialogRef<ThirdConfigModalComponent>, private service:ThirdServiceService){

  }

  closePopUp(){
    this.ref.close('closing from modal details');
  }

  ngOnInit(){
    this.inputData = this.data;
    this.entData = this.localStorageMethods.loadEnterpriseData();
  }

  addTypeId(items:any) {
    if (this.newItemName.trim()) {
      items.push({ name: this.newItemName });
      this.newItemName = '';
      this.showInputTypeId = false;
    }
  }

  addThirdType(items:any) {
    if (this.newItemName.trim()) {
      items.push({ name: this.newItemName });
      this.newItemName = '';
      this.showInputThirdType = false;
    }
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
