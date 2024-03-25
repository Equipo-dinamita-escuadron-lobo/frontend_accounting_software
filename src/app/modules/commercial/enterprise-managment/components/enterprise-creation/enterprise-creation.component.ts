import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnterpriseService } from '../../services/enterprise.service';
import { TaxLiabilityService } from '../../services/tax-liability.service';
import { TaxPayerTypeService } from '../../services/tax-prayer-type.service';
import { Enterprise } from '../../models/Enterprise';
import { PersonType } from '../../models/PersonType';
import { Location } from '../../models/Location';
import { EnterpriseList } from '../../models/EnterpriseList';
import { TaxLiability } from '../../models/TaxLiability';
import { TaxPayerType } from '../../models/TaxPrayerType';

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
  enterpriseList: EnterpriseList[] = [];
  taxLiabilitiesList: TaxLiability[] = [];
  taxPrayersList: TaxPayerType[] = [];
  selectedButtonType: string = 'legal';
  showLegalForm: boolean = true;
  showNaturalForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private enterpriseService: EnterpriseService,
    private taxLiabilityService: TaxLiabilityService,
    private taxPayerService: TaxPayerTypeService
  ) {
    this.form = this.fb.group(this.validations());
  }


  validations() {
    return {
      name: ['', [Validators.required, Validators.maxLength(50)]],
      nit: ['', [Validators.required, Validators.maxLength(15)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Suponiendo que el teléfono tiene 10 dígitos
      branch: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      logo: ['', Validators.required],
      taxLiabilities: [[], Validators.required],
      taxPayerType: [null, Validators.required],
      enterpriseType: ['', Validators.required],
      personType: ['', Validators.required],
      nameOwner: ['', [Validators.maxLength(50)]],
      surnameOwner: ['', [Validators.maxLength(50)]],
      businessName: ['', [Validators.maxLength(50)]],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', [Validators.required, Validators.maxLength(50)]],
      department: ['', [Validators.required, Validators.maxLength(50)]],
      dv: ['', [Validators.required, Validators.maxLength(1)]],
    }
  }

  selectLegalButton() {
    this.selectedButtonType = 'legal';
  }

  selectNaturalButton() {
    this.selectedButtonType = 'natural';
  }

  showLegalPersonForm() {
    this.selectLegalButton();
    this.showLegalForm = true;
    this.showNaturalForm = false;
  }

  showNaturalPersonForm() {
    this.selectNaturalButton();
    this.showLegalForm = false;
    this.showNaturalForm = true;
  }

  saveEnterprise() {

    const personTypeForm: PersonType = {
      type: this.form.value.personType,
      name: this.form.value.nameOwner,
      businessName: this.form.value.businessName,
      surname: this.form.value.surname
    }

    const locationForm: Location = {
      address: this.form.value.address,
      country: this.form.value.country,
      department: this.form.value.department,
      city: this.form.value.city
    }

    const enterprise: Enterprise = {
      name: this.form.value.name,
      nit: this.form.value.nit,
      phone: this.form.value.phone,
      branch: this.form.value.branch,
      email: this.form.value.email,
      logo: this.form.value.logo,
      taxLiabilities: this.form.value.taxLiabilities,
      taxPayerType: this.form.value.taxPayerType,
      personType: personTypeForm,
      location: locationForm,
      dv: this.form.value.dv,
      enterpriseType: this.form.value.enterpriseType
    }

    this.enterpriseService.createEnterprise(enterprise).subscribe(data => {
      //Logic TODO
    })
  }

  getAllEnterprises() {
    this.enterpriseService.getEnterprises().subscribe(data => {
      this.enterpriseList = data;
      console.log(data);
    })
  }

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
        this.taxPrayersList = data;
      }
    )
  }
}
