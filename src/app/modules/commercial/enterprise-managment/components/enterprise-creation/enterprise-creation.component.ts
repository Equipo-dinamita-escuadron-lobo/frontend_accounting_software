import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  AbstractControl,
} from '@angular/forms';
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
import { environment } from '../../../../../../environments/enviorment.development';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enterprise-creation',
  templateUrl: './enterprise-creation.component.html',
  styleUrl: './enterprise-creation.component.css',
})
export class EnterpriseCreationComponent {
  /**
   * Declaration of variables to create enterprise
   */

  form: FormGroup;
  form_legal: FormGroup;
  form_natural: FormGroup;
  

  /**
   * Arrays with information of services
   */

  enterpriseList: EnterpriseList[] = [];
  taxLiabilitiesList: TaxLiability[] = [];
  taxPayersList: TaxPayerType[] = [];
  departmenList: Department[] = [];
  cityList: { id: number; name: string }[] = [];
  enterpriseTypesList: EnterpriseType[] = [];

  /**
   * variables for the logo
   */
  file: File | null = null;

  /**
   * Variables to indicates what type of person
   */
  selectedButtonType: string = 'LEGAL_PERSON';
  showLegalForm: boolean = true;
  showNaturalForm: boolean = false;
  enabledSelectCity: boolean = false;

  /**
   * Placeholder
   */

  placeTypeEnterprise: string = 'Seleccione una opción';
  placeTypePayer: string = 'Seleccione una opción';
  placeTaxLiaabilities: string = 'Seleccione una opción(es)';
  placeDepartment: string = 'Seleccione una opción';
  placeCity: string = 'Seleccione una opción';

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
    private uploadService: EnterpriseService
  ) {
    this.form = this.fb.group(this.validationsAll());
    this.form_legal = this.fb.group(this.validationsLegal());
    this.form_natural = this.fb.group(this.validationsNatural());
  }

  ngOnInit(): void {
    this.getDepartments();
    this.getTypesEnterprise();
    this.getAllTaxPayeres();
    this.getAllTaxLiabilities();
  }

  /**
   *
   * @returns  validations of the form group
   */
  validationsAll() {
    return {
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9\s\-.,&()']+$/),
        ],
      ],
      nit: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^\d+$/),
        ],
      ],
      address: ['', [Validators.required, Validators.maxLength(30)]],
      phone: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(/^\d+$/),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9\s\-.]+$/),
        ],
      ],
      country: [
        { value: 'Colombia', disabled: true },
        [Validators.maxLength(50)],
      ],
      department: [
        { id: -1, name: '' },
        [Validators.required, Validators.maxLength(50)],
      ],
      dv: ['', [Validators.maxLength(10)]],
      selectedItemDepartment: [null, [this.selectedValueValidator]],
      selectedItemEnterpriseType: [null, [this.selectedValueValidator]],
      selectedItemTaxPayer: [null, [this.selectedValueValidator]],
      selectedItemTaxLiabilities: [null, [this.selectedValueValidator]],
      selectedItemCity: [null, [this.selectedValueValidator]],
      branchSelected: [false],
    };
  }

  validationsNatural() {
    return {
      nameOwner: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z]+$/),
        ],
      ],
      surnameOwner: [
        '',
        [Validators.required, Validators.maxLength(50)],
        Validators.pattern(/^[a-zA-Z]+$/),
      ],
    };
  }

  validationsLegal() {
    return {
      businessName: ['', [Validators.required, Validators.maxLength(50)]],
    };
  }

  validationsForm(): boolean {
    if (this.form.valid) {
      if (this.selectedButtonType == 'LEGAL_PERSON') {
        return this.form_legal.invalid;
      } else {
        return this.form_natural.invalid;
      }
    }

    return true;
  }

  selectedValueValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    if (
      control.value !== null &&
      control.value !== undefined &&
      control.value !== ''
    ) {
      return null; // El valor es válido
    } else {
      return { noValueSelected: true }; // El valor no es válido
    }
  }

  /**
   * @description Allows you to change the type of person to legal
   */
  showLegalPersonForm() {
    this.showLegalForm = true;
    this.showNaturalForm = false;
    this.selectedButtonType = 'LEGAL_PERSON';
  }

  /**
   * @description Allows you to change the type of person to natural
   */
  showNaturalPersonForm() {
    this.selectedButtonType = 'NATURAL_PERSON';
    this.showLegalForm = false;
    this.showNaturalForm = true;
  }

  /**
   * @description Allows to identify the status of the checkbox
   * @returns 0 if checkbox is not selected, 1 if it's selected
   */
  checkBranch() {
    if (this.form.value.branchSelected) {
      return 1;
    }
    return 0;
  }

  /**
 * @description Handle file selection event
 * @param event Event containing selected files
 */
  onSelect(event: any) {
    this.file = event.addedFiles[0];
  }

  /**
 * @description remove image
 */
  onRemove() {
    this.file = null;
  }

  /**
   * @description Function to upload an image to Cloudinary.
   * @return A promise that resolves to the URL of the uploaded image or is rejected with an error message.
   */
  upload(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.file) {
        resolve('');
        return;
      }

      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB en bytes
      if (this.file.size > MAX_FILE_SIZE) {
        Swal.fire({
          title: 'Error!',
          text: 'El tamaño del archivo excede el límite de 5 MB.',
          icon: 'error',
        });
        reject('El tamaño del archivo excede el límite de 5 MB.');
        return;
      }

      const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
      if (!ALLOWED_TYPES.includes(this.file.type)) {
        Swal.fire({
          title: 'Error!',
          text: 'Solo se permiten archivos de tipo JPEG o PNG.',
          icon: 'error',
        });
        reject('Solo se permiten archivos de tipo JPEG o PNG.');
        return;
      }

      const fileData = this.file;
      const data = new FormData();
      data.append('file', fileData);
      data.append('upload_preset', environment.storageDirectory);
      data.append('cloud_name', environment.storageName);

      this.uploadService.uploadImg(data).subscribe(
        (response: any) => {
          resolve(response.url);
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'Ha ocurrido un error al subir el logo.',
            icon: 'error',
          });
          reject(error);
        }
      );
    });
  }

  /**
   * @description Active select of city
   */
  enableSelectCity() {
    this.getCities(this.form.value.selectedItemDepartment.id);
    this.enabledSelectCity = true;
  }

  onDepartmentSelect(event: any) {
    this.form.value.selectedItemDepartment = event;
    this.enableSelectCity();
    this.placeDepartment = '';
  }

  onEnterpriseTypeSelect(event: any) {
    this.form.value.selectedItemEnterpriseType = event;
    this.placeTypeEnterprise = '';
  }

  onTaxPayerSelect(event: any) {
    this.form.value.selectedItemTaxPayer = event;
    this.placeTypePayer = '';
  }

  onCitySelect(event: any) {
    this.form.value.selectedItemCity = event;
    this.placeCity = '';
  }

  onTaxLiabilitySelect(event: any) {
    this.form.value.selectedItemTaxLiabilities = event;
    this.placeTaxLiaabilities = '';
  }

  /**
   * @description Desactive select of city
   */
  onSelectionDepartmentClear() {
    this.enabledSelectCity = false;
    this.form.value.selectedItemDepartment = { id: -1, name: '' };
    this.cityList = [];
  }

  onSelectionCityClear() {
    this.form.value.selectedItemCity = { id: -1, name: '' };
  }

  onSelectionTaxPayerClear() {
    this.form.value.selectedItemTaxPayer = { id: -1, name: '' };
  }

  onSelectionTypeEnterpriseClear() {
    this.form.value.selectedItemEnterpriseType = { id: -1, name: '' };
    this.placeTypeEnterprise = 'Seleccione el tipo de empresa';
  }
  /**
   * @description Save enterprise using Enterprise service
   */
  async saveEnterprise() {
    try {
      const personTypeForm: PersonType = {
        type: this.selectedButtonType,
        name: this.form.value.nameOwner,
        businessName: this.form.value.businessName,
        surname: this.form.value.surname,
      };

      const locationForm: Location = {
        address: this.form.value.address,
        country: 1,
        department: this.form.value.selectedItemDepartment.id,
        city: this.form.value.selectedItemCity.id,
      };

      var branchResponse: number = this.checkBranch();

      // Esperar la URL de la imagen antes de crear la empresa
      const logoUrl = await this.upload();

      const enterprise: Enterprise = {
        name: this.form.value.name,
        nit: this.form.value.nit,
        phone: this.form.value.phone,
        branch: '' + branchResponse,
        email: this.form.value.email,
        logo: logoUrl,
        taxLiabilities: this.form.value.selectedItemTaxLiabilities.map(
          (item: TaxLiability) => item.id
        ),
        taxPayerType: this.form.value.selectedItemTaxPayer.id,
        personType: personTypeForm,
        location: locationForm,
        dv: this.form.value.dv,
        enterpriseType: this.form.value.selectedItemEnterpriseType.id,
      };

      this.enterpriseService.createEnterprise(enterprise).subscribe(
        (data) => {
          // Caso de éxito (código de respuesta 200 OK)
          Swal.fire({
            title: 'Creación exitosa!',
            text: 'Se ha creado la empresa con éxito!',
            icon: 'success',
          });
          this.form.reset();
          this.file = null;
        },
        (error) => {
          // Caso de error
          Swal.fire({
            title: 'Error!',
            text: 'Ha ocurrido un error al crear la empresa.',
            icon: 'error',
          });
        }
      );
    } catch (error) {
      console.error('Error al cargar la imagen:', error);
    }
  }
  /**
   * Use the Taxlibility service to list in the select interface.
   */
  getAllTaxLiabilities() {
    this.taxLiabilitiesList = this.taxLiabilityService.getTaxLiabilities();
  }

  /**
   * Use the TaxPayer service to list in the select interface.
   */

  getAllTaxPayeres() {
    this.taxPayersList = this.taxPayerService.getTaxPayerTypes();
  }

  /**
   * Use the Department service to list in the select interface.
   */
  getDepartments() {
    this.departmenList = this.departmentService.getListDepartments();
  }

  /**
   * Use the City service to list in the select interface.
   */

  getCities(id: number) {
    this.cityService.getListCitiesByDepartment(id).subscribe((data) => {
      this.cityList = data.cities;
    });
  }

  /**
   * Use the EnterpriseType service to list in the select interface.
   */

  getTypesEnterprise() {
    this.enterpriseTypesList = this.enterpriseService.getTypesEnterprise();
  }
}
