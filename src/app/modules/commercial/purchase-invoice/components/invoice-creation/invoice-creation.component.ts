import { Component } from '@angular/core';
import { EnterpriseDetails } from '../../../enterprise-managment/models/Enterprise';
import { EnterpriseService } from '../../../enterprise-managment/services/enterprise.service';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceSelectSupplierComponent } from '../invoice-select-supplier/invoice-select-supplier.component';
import { ThirdServiceService } from '../../../third-parties-managment/services/third-service.service';
import { Third } from '../../../third-parties-managment/models/Third';

@Component({
  selector: 'app-invoice-creation',
  templateUrl: './invoice-creation.component.html',
  styleUrl: './invoice-creation.component.css'
})
export class InvoiceCreationComponent {

  enterpriseSelected?: EnterpriseDetails;
  showInfoTercero: boolean = false;
  selectProducts: boolean = false;

  lstThirds: Third[] = [];

  constructor(private enterpriseService: EnterpriseService, private dialog: MatDialog, private thirdService: ThirdServiceService) {

  }

  ngOnInit() {
    this.getEnterpriseSelectedInfo();
  }

  getEnterpriseSelectedInfo() {
    const id = this.enterpriseService.getSelectedEnterprise();
    console.log("id " + id)
    if (id === null) {

    } else {
      this.enterpriseService.getEnterpriseById(id).subscribe({
        next: (enterpriseData) => {
          this.enterpriseSelected = enterpriseData;
        },
      });
    }

    return this.enterpriseSelected;
  }

  getThirds(){
    
  }

  selectSupplier() {
    this.OpenDetailsImport('Seleccion de proveedor', InvoiceSelectSupplierComponent)
    this.showInfoTercero = !this.showInfoTercero;
  }

  createSupplier() {
    this.showInfoTercero = !this.showInfoTercero;
  }

  OpenDetailsImport(title: any, component: any) {
    var _popUp = this.dialog.open(component, {
      width: '40%',
      height: '100px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '100ms',
      data: {
        title: title
      }
    });
    _popUp.afterClosed().subscribe()
  }
}
