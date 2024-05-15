import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-account-import',
  templateUrl: './account-import.component.html',
  styleUrl: './account-import.component.css'
})
export class AccountImportComponent {

  inputData: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private ref:MatDialogRef<AccountImportComponent>){
    
  }

  closePopUp(){
    this.ref.close('closing from modal details');
  }

  ngOnInit(){
    this.inputData = this.data;
  }
}
