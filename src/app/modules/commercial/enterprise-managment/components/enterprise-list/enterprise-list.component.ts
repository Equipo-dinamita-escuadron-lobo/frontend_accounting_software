import { Component } from '@angular/core';
import { EnterpriseList } from '../../models/EnterpriseList';
import { EnterpriseService } from '../../services/enterprise.service';

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
  filterPost = '';

  constructor(private enterpriseServide:EnterpriseService){
    
  }

  ngOnInit():void{
    this.getEnterprises();
    this.showLegalPersonForm();
    this.showNaturalPersonForm();
  }

  getEnterprises(){
    this.enterpriseServide.getEnterprises().subscribe({
      next:(enterpriseData) =>{
        this.listEnterprises = enterpriseData;
      }
    })
  }

  empresas = [
    { 
      nombre: 'Empresa 1', 
      descripcion: 'Descripción de la Empresa 1', 
      imagenUrl: '../../../../../../assets/Iconos/enterprise/exitoLogo.png' 
    },
    { 
      nombre: 'Empresa 2', 
      descripcion: 'Descripción de la Empresa 2', 
      imagenUrl: '../../../../../../assets/Iconos/enterprise/exitoLogo.png' 
    },
    { 
      nombre: 'Empresa 3', 
      descripcion: 'Descripción de la Empresa 3', 
      imagenUrl: '../../../../../../assets/Iconos/enterprise/exitoLogo.png' 
    },
    { 
      nombre: 'Empresa 4', 
      descripcion: 'Descripción de la Empresa 4', 
      imagenUrl: '../../../../../../assets/Iconos/enterprise/exitoLogo.png' 
    },
    { 
      nombre: 'Empresa 5', 
      descripcion: 'Descripción de la Empresa 5', 
      imagenUrl: '../../../../../../assets/Iconos/enterprise/jumboIcono.png' 
    },
    { 
      nombre: 'Empresa 6', 
      descripcion: 'Descripción de la Empresa 6', 
      imagenUrl: '../../../../../../assets/Iconos/enterprise/jumboIcono.png'  
    },
    { 
      nombre: 'Empresa 7', 
      descripcion: 'Descripción de la Empresa 7', 
      imagenUrl: '../../../../../../assets/Iconos/enterprise/jumboIcono.png' 
    },
    { 
      nombre: 'Empresa 7', 
      descripcion: 'Descripción de la Empresa 7', 
      imagenUrl: '../../../../../../assets/Iconos/enterprise/jumboIcono.png' 
    }
  ];

  // Método para dividir las empresas en grupos de N(parametro)
  dividirEmpresasEnGrupos(empresas: any[], tamanoGrupo: number) {
    const grupos = [];
    for (let i = 0; i < empresas.length; i += tamanoGrupo) {
      grupos.push(empresas.slice(i, i + tamanoGrupo));
    }
    return grupos;
  }

  showLegalPersonForm() {
    this.showLegalForm = true;
    this.showNaturalForm = false;
  }

  showNaturalPersonForm() {
    this.showLegalForm = false;
    this.showNaturalForm = true;
  }
}
