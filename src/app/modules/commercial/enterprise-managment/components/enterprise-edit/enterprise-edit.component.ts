/**
 * @fileoverview Componente para la edición de empresas
 * 
 * Este componente permite:
 * - Editar información de empresas existentes
 * - Gestionar datos empresariales básicos y avanzados
 * - Manejar diferentes tipos de persona (natural/jurídica)
 * - Administrar ubicaciones y responsabilidades tributarias
 * - Gestionar logos empresariales
 * 
 * Funcionalidades principales:
 * - Formularios para edición de datos empresariales
 * - Validación de campos
 * - Carga y actualización de logos
 * - Gestión de ubicaciones (departamentos y ciudades)
 * - Control de responsabilidades tributarias
 * - Cálculo automático de dígito de verificación
 * 
 * @autor [CONTAPP]
 * @versión 1.0.0
 */

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
  /** Formularios para la gestión de datos */
  form: FormGroup;
  form_legal: FormGroup;
  form_natural: FormGroup;
  enterpriseEdit?: EnterpriseDetails;

  /** Textos de interfaz */
  title: string = 'Editar Empresa';
  subtitle: string = 'Ingrese toda la información requerida en los siguientes formularios';

  /** Listas de datos para selección */
  taxLiabilitiesList: TaxLiability[] = [];
  taxPayersList: TaxPayerType[] = [];
  departmenList: Department[] = [];
  cityList: { id: number; name: string }[] = [];
  enterpriseTypesList: EnterpriseType[] = [];

  /** Variables para el logo */
  file: File | null = null;
  imagenUrl: string | null = 'hol';

  /** Control de tipo de persona */
  selectedButtonType: string = 'LEGAL_PERSON';
  showLegalForm: boolean = true;
  showNaturalForm: boolean = false;
  enabledSelectCity: boolean = false;

  /** Textos placeholder */
  placeTypeEnterprise: string = 'Seleccione una opción';
  placeTypePayer: string = 'Seleccione una opción';
  placeTaxLiaabilities: string = 'Seleccione una opción(es)';
  placeDepartment: string = 'Seleccione una opción';
  placeCity: string = 'Seleccione una opción';

  /** Control de permisos */
  rol:boolean = false;

  /**
   * Constructor del componente
   * Inicializa servicios y formularios necesarios
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

  /**
   * Inicializa el componente
   * Carga datos necesarios
   */
  ngOnInit(): void {
    this.getDepartments();
    this.getTypesEnterprise();
    this.getAllTaxPayer();
    this.getAllTaxLiabilities();
  }

  /**
   * Actualiza los placeholders con la información de la empresa
   */
  changePlaceholderSelect() {
    this.placeTypeEnterprise = '' + this.enterpriseEdit?.enterpriseType.name;
    this.placeTypePayer = '' + this.enterpriseEdit?.taxPayerType.name;
    this.placeTaxLiaabilities = '' + this.enterpriseEdit?.taxLiabilities;
    this.placeDepartment = '' + this.enterpriseEdit?.location.department.name;
    this.placeCity = '' + this.enterpriseEdit?.location.city.name;
  }

  /**
   * Define las validaciones para todos los campos del formulario
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

  /**
   * Define las validaciones para persona natural
   */
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

  /**
   * Define las validaciones para persona jurídica
   */
  validationsLegal() {
    return {
      businessName: ['', [Validators.required, Validators.maxLength(50)]],
    };
  }

  /**
   * Valida el formulario según el tipo de persona
   */
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

  /**
   * Validador personalizado para campos de selección
   * @param control Control del formulario a validar
   */
  selectedValueValidator(control: AbstractControl): { [key: string]: boolean } | null {
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
   * Muestra el formulario para persona jurídica
   */
  showLegalPersonForm() {
    this.showLegalForm = true;
    this.showNaturalForm = false;
    this.selectedButtonType = 'LEGAL_PERSON';
  }

  /**
   * Muestra el formulario para persona natural
   */
  showNaturalPersonForm() {
    this.selectedButtonType = 'NATURAL_PERSON';
    this.showLegalForm = false;
    this.showNaturalForm = true;
  }

  /**
   * Verifica el estado del checkbox de sucursal
   */
  checkBranch() {
    if (this.form.value.branchSelected) {
      return 1;
    }
    return 0;
  }

  /**
   * Maneja la selección de archivos
   * @param event Evento de selección de archivo
   */
  onSelect(event: any) {
    this.file = event.addedFiles[0];
  }

  /**
   * Elimina el archivo seleccionado
   */
  onRemove() {
    this.file = null;
  }

  /**
   * Sube un archivo al servidor
   * @returns Promesa con la URL del archivo subido
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

  /**
   * Actualiza el dígito de verificación
   * @param nit NIT para calcular el dígito de verificación
   */
  updateDV(nit: string): void {
    if (nit && nit.length > 0) {
      const dv = this.calcularDigitoVerificacion(nit);
      // Establecer el valor del DV en el formulario
      this.form.get('dv')?.setValue(dv.toString());
    }
  }

  /**
   * Calcula el dígito de verificación para un NIT
   * @param numero NIT para calcular el dígito
   */
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
   * Habilita la selección de ciudad
   */
  enableSelectCity() {
    this.getCities(this.form.value.selectedItemDepartment.id);
    this.enabledSelectCity = true;
  }

  /**
   * Maneja la selección de departamento
   * @param event Evento de selección
   */
  onDepartmentSelect(event: any) {
    this.form.value.selectedItemDepartment = event;
    this.enableSelectCity();
    this.placeDepartment = '';
  }

  /**
   * Maneja la selección del tipo de empresa
   * @param event Evento de selección
   */
  onEnterpriseTypeSelect(event: any) {
    this.form.value.selectedItemEnterpriseType = event;
    this.placeTypeEnterprise = '';
  }

  /**
   * Maneja la selección del tipo de contribuyente
   * @param event Evento de selección
   */
  onTaxPayerSelect(event: any) {
    this.form.value.selectedItemTaxPayer = event;
    this.placeTypePayer = '';
  }

  /**
   * Maneja la selección de ciudad
   * @param event Evento de selección
   */
  onCitySelect(event: any) {
    this.form.value.selectedItemCity = event;
    this.placeCity = '';
  }

  /**
   * Maneja la selección de responsabilidades tributarias
   * @param event Evento de selección
   */
  onTaxLiabilitySelect(event: any) {
    this.form.value.selectedItemTaxLiabilities = event;
    this.placeTaxLiaabilities = '';
  }

  /**
   * Limpia la selección de departamento
   */
  onSelectionDepartmentClear() {
    this.enabledSelectCity = false;
    this.form.value.selectedItemDepartment = { id: -1, name: '' };
    this.cityList = [];
  }

  /**
   * Limpia la selección de ciudad
   */
  onSelectionCityClear() {
    this.form.value.selectedItemCity = { id: -1, name: '' };
  }

  /**
   * Limpia la selección del tipo de contribuyente
   */
  onSelectionTaxPayerClear() {
    this.form.value.selectedItemTaxPayer = { id: -1, name: '' };
  }

  /**
   * Limpia la selección del tipo de empresa
   */
  onSelectionTypeEnterpriseClear() {
    this.form.value.selectedItemEnterpriseType = { id: -1, name: '' };
    this.placeTypeEnterprise = 'Seleccione el tipo de empresa';
  }

  /**
   * Edita la información de la empresa
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
   * Obtiene todas las responsabilidades tributarias
   */
  getAllTaxLiabilities() {
    this.taxLiabilitiesList = this.taxLiabilityService.getTaxLiabilities();
  }

  /**
   * Obtiene todos los tipos de contribuyentes
   */
  getAllTaxPayer() {
    this.taxPayerService.getTaxPayerTypesBack().subscribe({
      next: (response: TaxPayerType[]) => {
        this.taxPayersList = response;
        console.log('Tipos de contribuyente obtenidos:', this.taxPayersList);
      },
      error: (error) => {
        console.log('Error al obtener tipos de contribuyente:', error);
      }
    });
  }

  /**
   * Obtiene la lista de departamentos
   */
  getDepartments() {
    this.departmenList = this.departmentService.getListDepartments();
  }

  /**
   * Obtiene las ciudades de un departamento
   * @param id ID del departamento
   */
  getCities(id: number) {
    this.cityService.getListCitiesByDepartment(id).subscribe((data) => {
      this.cityList = data.cities;
    });
  }

  /**
   * Obtiene los tipos de empresa disponibles
   */
  getTypesEnterprise() {
    this.enterpriseTypesList = this.enterpriseService.getTypesEnterprise();
  }

  /**
   * Navega a la vista de detalles
   */
  goToDetailsEnterprises() {
    this.router.navigate(['general/operations/home']);
  }

  /**
   * Obtiene la información de la empresa a editar
   */
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

  /**
   * Carga el logo de la empresa
   * @param url URL del logo
   */
  loadLogo(url: string) {
    if (url !== '') {
      this.enterpriseService.downloadLogo(url).subscribe((imagenArchivo) => {
        this.file = imagenArchivo;
      });
    }
  }

  /**
   * Rellena los campos del formulario con los valores de la empresa
   */
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
