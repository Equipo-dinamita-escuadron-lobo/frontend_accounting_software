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
  listEnterprises: EnterpriseList[] = [];
  selecteEnterprise ?: EnterpriseList;
  showLegalForm: boolean = true;
  showNaturalForm: boolean = false;
  filterEnterprise:string = '';

  constructor(private enterpriseServide:EnterpriseService){
    
  }

  ngOnInit():void{
    this.getEnterprises();
  }

  
  /*
  getEnterprises(){
    this.enterpriseServide.getEnterprises().subscribe({
      next:(enterpriseData) =>{
        this.listEnterprises = enterpriseData;
      }
    })
  }*/

  getEnterprises(){
    this.listEnterprises = this.enterpriseServide.getEnterprises();
  }


  // Método para dividir las empresas en grupos de N(parametro)
  divideEnterpriseInGroups( tamanoGrupo: number) {
    const grupos = [];
    for (let i = 0; i < this.listEnterprises.length; i += tamanoGrupo) {
      grupos.push(this.listEnterprises.slice(i, i + tamanoGrupo));
    }
    return grupos;
  }

}
