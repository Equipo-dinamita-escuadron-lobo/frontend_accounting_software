import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-account-import',
  templateUrl: './account-import.component.html',
  styleUrls: ['./account-import.component.css']
})
export class AccountImportComponent {
  inputData: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<AccountImportComponent>) { }

  ngOnInit() {
    this.inputData = this.data;
  }

  closePopUp() {
    this.ref.close('closing from modal details');
  }

  downloadExcel() {
    const fileUrl = '../../../../../../assets/data/chart-accounts/plantillaCatalogoCuentas.xlsx';
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = 'plantillaCatalogoCuentas.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
