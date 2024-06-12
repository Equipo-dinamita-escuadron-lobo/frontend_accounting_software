import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnterpriseDetails } from '../../../enterprise-managment/models/Enterprise';
import { EnterpriseService } from '../../../enterprise-managment/services/enterprise.service';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceSelectSupplierComponent } from '../invoice-select-supplier/invoice-select-supplier.component';
import { ThirdServiceService } from '../../../third-parties-managment/services/third-service.service';
import { Third } from '../../../third-parties-managment/models/Third';
import { InvoiceSelectProductsComponent } from '../invoice-select-products/invoice-select-products.component';

@Component({
  selector: 'app-invoice-creation',
  templateUrl: './invoice-creation.component.html',
  styleUrls: ['./invoice-creation.component.css']
})
export class InvoiceCreationComponent implements OnInit {
  enterpriseSelected?: EnterpriseDetails;

  //Variables for third parties
  showSectionThrid: boolean = true;
  showInfoThird: boolean = false;
  selectedSupplier: any;
  supplierS?: Third;
  lstThirds: Third[] = [];

  //Variables for products
  showSectionProducts: boolean = true;
  showInfoProducts: boolean = false;
  //TODO variables para almacenar los los productos seleccionados
  //lstProducts: Product[] = [];


  constructor(private enterpriseService: EnterpriseService,
    private dialog: MatDialog,
    private thirdService: ThirdServiceService) { }

  ngOnInit() {
    this.getEnterpriseSelectedInfo();
  }

  getEnterpriseSelectedInfo() {
    const id = this.enterpriseService.getSelectedEnterprise();
    console.log("id " + id);
    if (id === null) {
      // Manejar caso donde no hay empresa seleccionada
    } else {
      this.enterpriseService.getEnterpriseById(id).subscribe({
        next: (enterpriseData) => {
          this.enterpriseSelected = enterpriseData;
        },
      });
    }
    return this.enterpriseSelected;
  }

  getSupplier(thirdId: any) {
    if (thirdId) {
      this.thirdService.getThirdPartie(thirdId).subscribe({
        next: (response: Third) => {
          this.supplierS = response;
          console.log(this.supplierS.email)
        }
      })
    }
  }

  //Metodo para ventana emergetne de terceros
  selectSupplier() {
    this.OpenListThirds('Seleccion de proveedor', this.enterpriseSelected?.id, InvoiceSelectSupplierComponent);
  }
  //Metodo para llevar al formulario de crear tercero
  createSupplier() {
    this.showInfoThird = !this.showInfoThird;
  }
  showSectionThridM() {
    this.showSectionThrid = !this.showSectionThrid;
  }

  //Method for show window products
  selectProducts(){
    this.OpenListThirds('Seleccion de Productos', this.enterpriseSelected?.id, InvoiceSelectProductsComponent);
  }
  showSectionProductsM(){
    this.showSectionProducts = !this.showSectionProducts;
  }

  OpenListThirds(title: any, entId: any, component: any) {
    const _popUp = this.dialog.open(component, {
      width: '40%',
      height: 'auto',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '100ms',
      data: {
        title: title,
        entId: entId
      }
    });

    _popUp.afterClosed().subscribe(result => {
      if (result) {
        console.log('Información recibida del modal:', result);
        this.selectedSupplier = result;
        this.showInfoThird = true;
        this.getSupplier(result);
      } else {
        this.showInfoThird = false;
      }
    });
  }
}
