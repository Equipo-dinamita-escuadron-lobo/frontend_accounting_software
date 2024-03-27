import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnterpriseService } from '../../services/enterprise.service';
import { TaxLiabilityService } from '../../services/tax-liability.service';
import { TaxPayerTypeService } from '../../services/tax-payer-type.service';
import { Enterprise } from '../../models/Enterprise';
import { PersonType } from '../../models/PersonType';
import { Location } from '../../models/Location';
import { EnterpriseList } from '../../models/EnterpriseList';
import { TaxLiability } from '../../models/TaxLiability';
import { TaxPayerType } from '../../models/TaxPayerType';
import { CityService } from '../../services/city.service';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/Department';
import { City } from '../../models/City';
import { EnterpriseType } from '../../models/EnterpriseType';
import { EnterpriseTypeService } from '../../services/enterprise-type.service';

@Component({
  selector: 'app-enterprise-creation',
  templateUrl: './enterprise-creation.component.html',
  styleUrl: './enterprise-creation.component.css'
})
export class EnterpriseCreationComponent {
  /**
   * Declaration of variables to create enterprise
   */

  form: FormGroup;
  
  /**
   * Arrays with information of services
   */

  enterpriseList: EnterpriseList[] = [];
  taxLiabilitiesList: TaxLiability[] = [];
  taxPayersList: TaxPayerType[] = [];
  departmenList: Department[] = [];
  cityList: City[] = [];
  enterpriseTypesList: EnterpriseType[] = [];

  /**
   * Variables to indicates what type of person 
   */
  selectedButtonType: string = 'LEGAL_PERSON';
  showLegalForm: boolean = true;
  showNaturalForm: boolean = false;

  /**
   * Variables to save the items selectioned on the interface
   */
  selectedItemDepartment: Department = {id:-1, name:''};
  selectedItemEnterpriseType: EnterpriseType = {id:-1, name:''};
  selectedItemTaxPayer: TaxPayerType = {id:-1, name:''} ;
  selectedItemTaxLiabilities:TaxLiability[] = [];
  selectedItemCity: City = {id:-1, name:''};
  branchSelected: boolean = false;

  /**
   * 
   * @param fb To form reactive
   * @param enterpriseService  
   * @param taxLiabilityService 
   * @param taxPayerService 
   * @param cityService 
   * @param departmentService 
   * @param enterpriseTypesService 
   * @description constructor to initialice services 
   */
  constructor(
    private fb: FormBuilder,
    private enterpriseService: EnterpriseService,
    private taxLiabilityService: TaxLiabilityService,
    private taxPayerService: TaxPayerTypeService,
    private cityService: CityService,
    private departmentService: DepartmentService,
    private enterpriseTypesService: EnterpriseTypeService
  ) {
    this.form = this.fb.group(this.validations());
  }

  ngOnInit():void{
    this.getDepartments();
    this.getTypesEnterprise();
    this.getAllTaxPayeres();
    this.getAllTaxLiabilities();
    this.getCities();
  }

/**
 * 
 * @returns  validations of the form group
 */
  validations() {
    return {
      name: ['', [Validators.required, Validators.maxLength(50)]],
      nit: ['', [Validators.required, Validators.maxLength(15)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      logo: ['', Validators.required],
      nameOwner: ['', [Validators.maxLength(50)]],
      surnameOwner: ['', [Validators.maxLength(50)]],
      businessName: ['', [Validators.maxLength(50)]],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      country: [{ value: 'Colombia', disabled: true }, [Validators.maxLength(50)]],
      department: ['', [Validators.required, Validators.maxLength(50)]],
      dv: ['', [Validators.required, Validators.maxLength(1)]],
    }
  }



  showLegalPersonForm() {
    this.showLegalForm = true;
    this.showNaturalForm = false;
    this.selectedButtonType = 'LEGAL_PERSON';
  }

  showNaturalPersonForm() {
    this.selectedButtonType = 'NATURAL_PERSON';
    this.showLegalForm = false;
    this.showNaturalForm = true;
  }

checkBranch() {
    if (this.branchSelected) {
      return 1;
    } 
    return 0;
}


  saveEnterprise() {
    const personTypeForm: PersonType = {
      type: this.selectedButtonType,
      name: this.form.value.nameOwner,
      businessName: this.form.value.businessName,
      surname: this.form.value.surname
    }

    const locationForm: Location = {
      address: this.form.value.address,
      country: 0,
      department: this.selectedItemDepartment.id,
      city: this.selectedItemCity.id
    }

    const enterprise: Enterprise = {
      name: this.form.value.name,
      nit: this.form.value.nit,
      phone: this.form.value.phone,
      branch: ''+this.checkBranch,
      email: this.form.value.email,
      logo: this.form.value.logo,
      taxLiabilities: this.selectedItemTaxLiabilities.map(item => item.id),
      taxPayerType: this.selectedItemTaxPayer.id,
      personType: personTypeForm,
      location: locationForm,
      dv: this.form.value.dv,
      enterpriseType: this.selectedItemEnterpriseType.id
    }

    this.enterpriseService.createEnterprise(enterprise).subscribe(data => {
      //Logic TODO
    })
  }



  /*
  getAllTaxLiabilities() {
    this.taxLiabilityService.getTaxLiabilities().subscribe(

      data => {
        this.taxLiabilitiesList = data;
      }
    )
  }

  
  getAllTaxPayeres() {
    this.taxPayerService.getTaxPayerTypes().subscribe(
      data => {
        this.taxPayersList = data;
      }
    )
  }
  
  getDepartments() {
    this.departmentService.getListDepartments().subscribe(
      data => {
        this.departmenList = data;
      }
    )}

          getCities(id:number) {
      this.cityService.getListCitiesByDepartment(id).subscribe(
        data => {
          this.cityService = data;
        }
      )}

         getTypesEnterprise() {
        this.enterpriseTypesService.getListTypesEnterprise().subscribe(
          data => {
            this.enterpriseTypesList = data;
          }
        )}


  */


  getAllTaxLiabilities() {
    this.taxLiabilitiesList = this.taxLiabilityService.getTaxLiabilities();
  }

  getAllTaxPayeres() {
    this.taxPayersList = this.taxPayerService.getTaxPayerTypes();
  }

  getDepartments(){
    this.departmenList = this.departmentService.getListDepartments();
  }

  getTypesEnterprise(){
    this.enterpriseTypesList = this.enterpriseTypesService.getListTypesEnterprise();
  }

  getCities(){
    this.cityList = this.cityService.getListCitiesByDepartment(1);
  }
}
