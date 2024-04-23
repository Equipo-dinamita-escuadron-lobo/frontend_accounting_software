import { Component } from '@angular/core';
import { EnterpriseList } from '../../models/EnterpriseList';
import { EnterpriseService } from '../../services/enterprise.service';
import { FormsModule } from '@angular/forms';

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

  constructor(private enterpriseServide:EnterpriseService){
    
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

  updateEnterpriseSelected(id:string){
    this.enterpriseServide.setSelectedEnterprise(id);
  }

  /*
  getEnterprises(){
    this.listEnterprisesActive = this.enterpriseServide.getEnterprises();
  }*/

}
