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
import { Enterprise, EnterpriseDetails } from '../../models/Enterprise';
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
import { Router } from '@angular/router';
import { AuthService } from '../../../../principal/login/services/auth.service';
import { buttonColors } from '../../../../../shared/buttonColors';

@Component({
  selector: 'app-enterprise-edit',
  templateUrl: './enterprise-edit.component.html',
  styleUrl: './enterprise-edit.component.css',
})
export class EnterpriseEditComponent {
  /**
   * Declaration of variables to create enterprise
   */

  form: FormGroup;
  form_legal: FormGroup;
  form_natural: FormGroup;
  enterpriseEdit?: EnterpriseDetails;

  title: string = 'Editar Empresa';
  subtitle: string =
    'Ingrese toda la información requerida en los siguientes formularios';

  /**
   * Arrays with information of services
   */

  taxLiabilitiesList: TaxLiability[] = [];
  taxPayersList: TaxPayerType[] = [];
  departmenList: Department[] = [];
  cityList: { id: number; name: string }[] = [];
  enterpriseTypesList: EnterpriseType[] = [];

  /**
   * variables for the logo
   */
  file: File | null = null;
  imagenUrl: string | null = 'hol';

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

  rol:boolean = false;

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
    private uploadService: EnterpriseService,
    private router: Router,
  ) {
    this.form = this.fb.group(this.validationsAll());
    this.form_legal = this.fb.group(this.validationsLegal());
    this.form_natural = this.fb.group(this.validationsNatural());
    this.getEnterpriseEdit();

    this.form.get('nit')?.valueChanges.subscribe(value => {
      this.updateDV(value);
    });
  }

  ngOnInit(): void {
    this.getDepartments();
    this.getTypesEnterprise();
    this.getAllTaxPayeres();
    this.getAllTaxLiabilities();
  }

  changePlaceholderSelect() {
    this.placeTypeEnterprise = '' + this.enterpriseEdit?.enterpriseType.name;
    this.placeTypePayer = '' + this.enterpriseEdit?.taxPayerType.name;
    this.placeTaxLiaabilities = '' + this.enterpriseEdit?.taxLiabilities;
    this.placeDepartment = '' + this.enterpriseEdit?.location.department.name;
    this.placeCity = '' + this.enterpriseEdit?.location.city.name;
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
          Validators.pattern(/^[a-zA-Z0-9\s\-.@]+$/),
        ],
      ],
      country: [
        { value: 'Colombia', disabled: true },
        [Validators.maxLength(50)],
      ],

      mainActivity:[
        '',
        [
          Validators.maxLength(15),
          Validators.pattern(/^\d+$/),
        ],
      ],
      secondaryActivity: [
        '',
        [
          Validators.maxLength(15),
          Validators.pattern(/^\d+$/),
        ],
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
          Validators.pattern(/^[a-zA-Z\s]+$/),
        ],
      ],
      surnameOwner: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z\s]+$/), // Modificada para permitir espacios
        ],
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
      if (this.selectedButtonType === 'LEGAL_PERSON') {
        console.log('juridica');
        return this.form_legal.invalid;
      } else if (this.selectedButtonType === 'NATURAL_PERSON') {
        console.log('natural');
        console.log(this.form_natural.invalid);
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
          title: 'Error',
          text: 'El tamaño del archivo excede el límite de 5 MB.',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
        reject('El tamaño del archivo excede el límite de 5 MB.');
        return;
      }

      const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
      if (!ALLOWED_TYPES.includes(this.file.type)) {
        Swal.fire({
          title: 'Error',
          text: 'Solo se permiten archivos de tipo JPEG o PNG.',
          confirmButtonColor: buttonColors.confirmationColor,
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
            title: 'Error',
            text: 'Ha ocurrido un error al subir el logo.',
            confirmButtonColor: buttonColors.confirmationColor,
            icon: 'error',
          });
          reject(error);
        }
      );
    });
  }

  // Funcion para calcular el digito de verficacion
  updateDV(nit: string): void {
    if (nit && nit.length > 0) {
      const dv = this.calcularDigitoVerificacion(nit);
      // Establecer el valor del DV en el formulario
      this.form.get('dv')?.setValue(dv.toString());
    }
  }

  // Función para calcular el dígito de verificación usando la fórmula proporcionada
  private calcularDigitoVerificacion(numero: string): number {
    const pesos = [71, 67, 59, 53, 47, 43, 41, 37, 29, 23, 19, 17, 13, 7, 3];
    const numeroFormateado = numero.padStart(15, '0'); // Aseguramos que el número tenga 15 dígitos
    let suma = 0;

    // Sumar los productos de cada dígito por su peso correspondiente
    for (let i = 0; i < 15; i++) {
      suma += parseInt(numeroFormateado.charAt(i)) * pesos[i];
    }

    // Calcular el residuo de la suma dividida entre 11
    const residuo = suma % 11;
    let digitoVerificacion;

    // Determinar el dígito de verificación en función del residuo
    if (residuo === 0) {
      digitoVerificacion = 0;
    } else if (residuo === 1) {
      digitoVerificacion = 1;
    } else {
      digitoVerificacion = 11 - residuo;
    }

    return digitoVerificacion;
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
  async editEnterprise() {
    if (!this.validationsForm()) {
      try {
        const personTypeForm: PersonType = {
          type: this.selectedButtonType,
          name: this.form_natural.value.nameOwner,
          bussinessName: this.form_legal.value.businessName,
          surname: this.form_natural.value.surnameOwner,
        };

        const locationForm: Location = {
          address: this.form.value.address,
          country: 1,
          department: this.form.value.selectedItemDepartment.id,
          city: this.form.value.selectedItemCity.id,
        };

        var branchResponse: number = this.checkBranch();

        // Esperar la URL de la imagen antes de crear la empresa
        const logoUrl: string = await this.upload();

        const enterprise: Enterprise = {
          name: this.form.value.name,
          nit: this.form.value.nit,
          phone: this.form.value.phone,
          branch: '' + branchResponse,
          email: this.form.value.email,
          logo: logoUrl,
          mainActivity: this.form.value.mainActivity.valueOf(),
          secondaryActivity: this.form.value.secondaryActivity.valueOf(),
          state: 'ACTIVE',
          taxLiabilities: this.form.value.selectedItemTaxLiabilities.map(
            (item: TaxLiability) => item.id
          ),
          taxPayerType: this.form.value.selectedItemTaxPayer.id,
          personType: personTypeForm,
          location: locationForm,
          dv: this.form.value.dv,
          enterpriseType: this.form.value.selectedItemEnterpriseType.id,
        };
        
        console.log("Datos que va a actualizar"+enterprise.mainActivity);
        console.log("Datos que va a actualizar"+enterprise.secondaryActivity);

        this.enterpriseService
          .updateEnterprise(this.enterpriseEdit?.id, enterprise)
          .subscribe(
            (data) => {
              // Caso de éxito (código de respuesta 200 OK)
              Swal.fire({
                title: 'Edición exitosa',
                text: 'Se ha editado la empresa con éxito!',
                confirmButtonColor: buttonColors.confirmationColor,
                icon: 'success',
              });
              this.router.navigate(['general/operations/home']);
            },
            (error) => {
              // Caso de error
              Swal.fire({
                title: 'Error',
                text: 'Ha ocurrido un error al editar la empresa.',
                confirmButtonColor: buttonColors.confirmationColor,
                icon: 'error',
              });
            }
          );
      } catch (error) {
        console.error('Error al cargar la imagen:', error);
      }
    } else {
      // Caso de error
      Swal.fire({
        position: 'top-end',
        text: 'Faltan campos por llenar',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });

      console.log(this.form.errors);
      console.log(this.form_legal.errors);
      console.log(this.form_natural.errors);

      if (this.selectedButtonType === 'LEGAL_PERSON') {
        this.form_legal.markAllAsTouched;
        this.form.markAllAsTouched;
      } else if (this.selectedButtonType === 'NATURAL_PERSON') {
        this.form_natural.markAllAsTouched;
        this.form.markAllAsTouched;
      }
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

  goToDetailsEnterprises() {
    this.router.navigate(['general/operations/home']);
  }

  getEnterpriseEdit() {
    const id = ''+ this.enterpriseService.getSelectedEnterprise();
    this.enterpriseService
      .getEnterpriseById(id)
      .subscribe((data) => {
        this.enterpriseEdit = data;
        this.changePlaceholderSelect();
        this.fillFieldsWithValues();
        this.selectedButtonType = this.enterpriseEdit.personType.type;
        this.loadLogo(this.enterpriseEdit.logo);
        if (this.selectedButtonType === 'NATURAL_PERSON') {
          this.showNaturalPersonForm();
        }
      });
  }

  loadLogo(url: string) {
    if (url !== '') {
      this.enterpriseService.downloadLogo(url).subscribe((imagenArchivo) => {
        this.file = imagenArchivo;
      });
    }
  }

  fillFieldsWithValues() {
    this.form.setValue({
      name: this.enterpriseEdit?.name,
      nit: this.enterpriseEdit?.nit,
      address: this.enterpriseEdit?.location.address,
      phone: this.enterpriseEdit?.phone,
      email: this.enterpriseEdit?.email,
      mainActivity: this.enterpriseEdit?.mainActivity,
      secondaryActivity:this.enterpriseEdit?.secondaryActivity,
      dv: this.enterpriseEdit?.dv,
      selectedItemDepartment: this.enterpriseEdit?.location.department,
      selectedItemEnterpriseType: this.enterpriseEdit?.enterpriseType,
      selectedItemTaxPayer: this.enterpriseEdit?.taxPayerType,
      selectedItemCity: this.enterpriseEdit?.location.city,
      selectedItemTaxLiabilities: this.enterpriseEdit?.taxLiabilities,
      country: this.enterpriseEdit?.location.country,
      branchSelected: false,
    });
    this.form.markAllAsTouched();

    this.form_legal.setValue({
      businessName: this.enterpriseEdit?.personType.bussinessName,
    });

    this.form_natural.setValue({
      surnameOwner: this.enterpriseEdit?.personType.surname,
      nameOwner: this.enterpriseEdit?.personType.name,
    });

    this.form_legal.markAllAsTouched();
    this.form_natural.markAllAsTouched();
  }
}
