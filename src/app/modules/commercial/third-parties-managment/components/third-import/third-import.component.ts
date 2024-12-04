import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
    selector: 'app-third-export',
    templateUrl: './third-import.component.html',
    styleUrls: ['./third-import.component.css']
})
export class ThirdImportComponent {
    inputData: any;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<ThirdImportComponent>) { }
    ngOnInit() {
        this.inputData = this.data;
    }
    closePopUp() {
        this.ref.close('closing from modal details');
    }
    downloadExcel() {
        const fileUrl = '../../../../../../assets/data/thirds-parties/plantillaThirds.xlsx';
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = 'plantillaThirds.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}