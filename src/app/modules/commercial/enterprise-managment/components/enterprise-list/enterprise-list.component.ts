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
  listEnterprisesActive: EnterpriseList[] = [ ];
  listEnterprisesInctive: EnterpriseList[] = [ ];

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
    this.enterpriseServide.getEnterprisesActive().subscribe({
      next:(enterpriseData) =>{
        this.listEnterprisesActive = enterpriseData;
      }
    })
  }

  goToCreateEnterprise(){
    this.router.navigate(['general/enterprises/create']);
  }

  updateEnterpriseSelected(id:string){
    this.logInEnterprise();
    this.enterpriseServide.setSelectedEnterprise(id);
  }

  logInEnterprise(){
    this.router.navigate(['general/enterprises/details']);

  }


  /*
  getEnterprises(){
    this.listEnterprisesActive = this.enterpriseServide.getEnterprises();
  }*/

}
