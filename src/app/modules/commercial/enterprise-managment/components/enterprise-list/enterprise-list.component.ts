import { Component } from '@angular/core';
import { EnterpriseList } from '../../models/EnterpriseList';
import { EnterpriseService } from '../../services/enterprise.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Enterprise } from '../../models/Enterprise';

@Component({
  selector: 'app-enterprise-list',
  templateUrl: './enterprise-list.component.html',
  styleUrls: ['./enterprise-list.component.css']
})
export class EnterpriseListComponent {
  filterName: string = "";
  listEnterprises: EnterpriseList[] = [];
  selecteEnterprise ?: EnterpriseList;
  showLegalForm: boolean = true;
  showNaturalForm: boolean = false;
  filterEnterprise:string = '';

  selectedEnterprise: EnterpriseList | null = null;

  constructor(private enterpriseServide:EnterpriseService, private router: Router){

  }

  ngOnInit():void{
    this.getEnterprises();
  }

  getEnterprises(){
    this.enterpriseServide.getEnterprises().subscribe({
      next:(enterpriseData) =>{
        this.listEnterprises = enterpriseData;
      }
    })
  }

  goToCreateEnterprise(){
    this.router.navigate(['general/enterprises/create']);
  }

  selectEnterprise(empresa: Enterprise) {
    if(empresa){
      this.selectedEnterprise = empresa;
    }
  }

  closeInfoEnterprise(){
    this.selectedEnterprise = null;
  }

  logInEnterprise(){
    this.saveInfoEnterprise();
    this.router.navigate(['general/operations']);
  }

  saveInfoEnterprise(){

    if(this.selectedEnterprise){
      const dataEnt = {
        id: this.selectedEnterprise.id,
        name: this.selectedEnterprise.name
      }

      console.log(dataEnt);


      localStorage.setItem('entData', JSON.stringify(dataEnt));
    }
  }


  /*
  getEnterprises(){
    this.listEnterprises = this.enterpriseServide.getEnterprises();
  }*/

}
