/**
 * @fileoverview Componente para la importación de terceros desde plantilla Excel
 * 
 * Este componente permite:
 * - Descargar la plantilla Excel para importación de terceros
 * - Proporcionar un formato estandarizado para la carga de datos
 * - Facilitar la importación masiva de terceros
 * 
 * Funcionalidades principales:
 * - Descarga de plantilla Excel predefinida
 * - Manejo de diálogo modal
 * - Gestión de archivos de plantilla
 * 
 * @author [CONTAPP]
 * @version 1.0.0
 */

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
    selector: 'app-third-export',
    templateUrl: './third-import.component.html',
    styleUrls: ['./third-import.component.css']
})
export class ThirdImportComponent {
    /** Datos recibidos como input en el componente */
    inputData: any;

    /**
     * Constructor del componente
     * @param data Datos pasados al componente a través del diálogo
     * @param ref Referencia al diálogo modal
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any, 
        private ref: MatDialogRef<ThirdImportComponent>
    ) { }

    /**
     * Inicializa el componente con los datos recibidos
     */
    ngOnInit() {
        this.inputData = this.data;
    }

    /**
     * Cierra el diálogo modal
     */
    closePopUp() {
        this.ref.close('closing from modal details');
    }

    /**
     * Descarga la plantilla Excel para importación de terceros
     * Utiliza un enlace temporal para la descarga del archivo
     */
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