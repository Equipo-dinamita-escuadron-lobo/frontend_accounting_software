import { Component, Inject, OnInit, Optional, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../../../environments/enviorment.development';
import { Department } from '../../models/Department';
import { Enterprise } from '../../models/Enterprise';
import { EnterpriseList } from '../../models/EnterpriseList';
import { EnterpriseType } from '../../models/EnterpriseType';
import { Location } from '../../models/Location';
import { PersonType } from '../../models/PersonType';
import { TaxLiability } from '../../models/TaxLiability';
import { TaxPayerType } from '../../models/TaxPayerType';
import { CityService } from '../../services/city.service';
import { DepartmentService } from '../../services/department.service';
import { EnterpriseService } from '../../services/enterprise.service';
import { TaxLiabilityService } from '../../services/tax-liability.service';
import { TaxPayerTypeService } from '../../services/tax-payer-type.service';
import { buttonColors } from '../../../../../shared/buttonColors';
import { get } from 'jquery';
import { InvoiceSelectSupplierComponent } from '../../../purchase-invoice/components/invoice-select-supplier/invoice-select-supplier.component';
import { Tooltip } from '../../../third-parties-managment/models/Tooltip';
import { TooltipService } from '../../../third-parties-managment/services/tooltip.service';

@Component({
  selector: 'app-enterprise-creation',
  templateUrl: './enterprise-creation.component.html',
  styleUrl: './enterprise-creation.component.css',
})
export class EnterpriseCreationComponent implements OnInit {
  /**
   * Declaration of variables to create enterprise
   */

  tooltipId: string = '';
  tooltipText: string = '';
  tooltips: Tooltip[] = [];
  createdThirdForm!: FormGroup;
  currentTooltip: Tooltip | undefined;
  isTooltipVisible: boolean = false;
  isEditingTooltip: boolean = false;
  editTooltipText: string = ''; // Propiedad temporal para la edición del tooltip
  tooltipPosition = { top: 0, left: 0 }; // Posición del tooltip
  @ViewChildren('tooltipTrigger') tooltipTriggers!: QueryList<ElementRef>; // Referencia a los elementos del tooltip
  tooltipForm: FormGroup;

  isForeign: boolean = false;

  form: FormGroup;
  form_legal: FormGroup;
  form_natural: FormGroup;
  
  verificationNumber: number | null = null;
  submitted = false;
  

  title:string = 'Creacion de Empresa'
  subtitle:string = 'Ingrese toda la información requerida en los siguientes formularios'

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
    private tooltipService: TooltipService,
    
    private fb: FormBuilder,
    private enterpriseService: EnterpriseService,
    private taxLiabilityService: TaxLiabilityService,
    private taxPayerService: TaxPayerTypeService,
    private cityService: CityService,
    private departmentService: DepartmentService,
    private uploadService: EnterpriseService,
    private router: Router
  ) {
    this.form = this.fb.group(this.validationsAll());
    this.form_legal = this.fb.group(this.validationsLegal());
    this.form_natural = this.fb.group(this.validationsNatural());
    
    this.tooltipForm = this.fb.group({
      entId: ['', Validators.required],
      tip: ['', Validators.required]
    });

   /* this.form = this.fb.group({
      nit: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      dv: [{ value: '', disabled: true }]
    });*/
  }

  ngOnInit(): void {
    this.loadTooltips(); // Cargar los tooltips al inicializar el componente

    this.getDepartments(1);
    this.getTypesEnterprise();
    this.getAllTaxPayeres();
    this.getAllTaxLiabilities();

    this.form.get('nit')?.valueChanges.subscribe(value => {
      this.calculateVerificationNumber();
    });
  }

  // crear cuadro texto de ayuda aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  showTooltip(id: string, event: MouseEvent): void {
    this.tooltipService.getTooltipById(id).subscribe(
      (tooltip) => {
        this.currentTooltip = tooltip;
        const target = event.target as HTMLElement;
        const rect = target.getBoundingClientRect();
        this.tooltipPosition = { top: rect.top + window.scrollY + 20, left: rect.left + window.scrollX + 20 };
        this.isTooltipVisible = true;
      },
      (error) => {
        console.error('Error al cargar el tooltip:', error);
      }
    );
  }
  hideTooltip(): void {
    this.isTooltipVisible = false;
  }
  editTooltip(id: string, event: MouseEvent): void {
    this.tooltipService.getTooltipById(id).subscribe(
      (tooltip) => {
        this.currentTooltip = tooltip;
        this.editTooltipText = tooltip.tip; // Asignar el texto del tooltip a la propiedad temporal
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        this.tooltipPosition = { top: rect.top + window.scrollY + 20, left: rect.left + window.scrollX + 20 };
        this.isEditingTooltip = true;
      },
      (error) => {
        console.error('Error al cargar el tooltip:', error);
      }
    );
  }
  closeEditTooltip(): void {
    this.isEditingTooltip = false;
  }
  onSubmitEditTooltip(): void {
    if (this.currentTooltip) {
      this.currentTooltip.tip = this.editTooltipText; // Actualizar el texto del tooltip
      this.tooltipService.updateTooltip(this.currentTooltip.entId, this.currentTooltip).subscribe(
        (response) => {
          console.log('Tooltip actualizado:', response);
          this.isEditingTooltip = false;
          this.loadTooltips(); // Actualizar la lista de tooltips
        },
        (error) => {
          console.error('Error al actualizar el tooltip:', error);
        }
      );
    }
  }

  createTooltip(): void {
    if (this.tooltipForm.valid) {
      const newTooltip: Tooltip = this.tooltipForm.value;
      this.tooltipService.createTooltip2(newTooltip).subscribe(
        (response) => {
          console.log('Tooltip creado:', response);
          // Aquí puedes agregar lógica adicional, como mostrar una notificación
        },
        (error) => {
          console.error('Error al crear el tooltip:', error);
        }
      );
    }
  }

  onSubmit(): void {
    const tooltip: Tooltip = { entId: this.tooltipId, tip: this.tooltipText };
    this.tooltipService.updateTooltip(this.tooltipId, tooltip).subscribe(
      (response) => {
        console.log('Tooltip actualizado:', response);
        this.loadTooltips(); // Actualizar la lista de tooltips
      },
      (error) => {
        console.error('Error al actualizar el tooltip:', error);
      }
    );
  }
  loadTooltips(): void {
    this.tooltipService.getAllTooltips().subscribe(
      (response) => {
        this.tooltips = response;
        console.log('Tooltips cargados:', this.tooltips);
      },
      (error) => {
        console.error('Error al cargar los tooltips:', error);
      }
    );
  }


  // ************************************************************
  
  calculateVerificationNumber(): void {
    const nit = this.form.get('nit')?.value;
    if (nit) {
      this.verificationNumber = this.calculateDV(nit);
      this.form.get('dv')?.setValue(this.verificationNumber);
    }
  }

  calculateDV(nit: string): number {
    let vpri = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
    let x = 0;
  
    for (let i = 0; i < nit.length; i++) {
      x += parseInt(nit[nit.length - 1 - i], 10) * vpri[i];
    }
  
    let y = x % 11;
    return (y > 1) ? 11 - y : y;
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
        { value: 'country', disabled: true },
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
    this.form.reset();
    this.form_legal.reset();
    this.form_natural.reset();
  }

  /**
   * @description Allows you to change the type of person to natural
   */
  showNaturalPersonForm() {
    this.selectedButtonType = 'NATURAL_PERSON';
    this.showLegalForm = false;
    this.showNaturalForm = true;
    this.form.reset();
    this.form_legal.reset();
    this.form_natural.reset();
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

  /**
   * @description Active select of city
   */
  enableSelectCity() {
    this.getCities(this.form.value.selectedItemDepartment.id);
    this.enabledSelectCity = true;
  }

  //seleccion entre colombia o extranjero aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  onCountryChange(event: any) {
    this.isForeign = event.target.value === 'Extranjero';
    if (this.isForeign) {
        this.getDepartments(2);        
        //this.enableSelectCity();
        this.form.get('selectedItemDepartment')!.reset();
        this.form.get('selectedItemCity')!.reset();
    } else {
        this.getDepartments(1);
        //this.enableSelectCity();
        this.form.get('selectedItemDepartment')!.reset();
        this.form.get('selectedItemCity')!.reset();
    }
  }

  actSelectioCountry(){ 
    if (this.isForeign) {
      return 2;
    } else {
      return 1;
    }
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

    

    if(!this.validationsForm()){
      try {
        const personTypeForm: PersonType = {
          type: this.selectedButtonType,
          name: this.form_natural.value.nameOwner,
          bussinessName: this.form_legal.value.businessName,
          surname: this.form_natural.value.surnameOwner,
        };
  
        const locationForm: Location = {
          address: this.form.value.address,
          
          country: this.actSelectioCountry(),
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
          mainActivity: this.form.value.mainActivity,
          secondaryActivity: this.form.value.secondaryActivity,
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
              title: 'Creación exitosa',
              text: 'Se ha creado la empresa con éxito!',
              confirmButtonColor: buttonColors.confirmationColor,
              icon: 'success',
            });
            this.form.reset();
            this.form_legal.reset();
            this.form_natural.reset();
            this.file = null;
          },
          (error) => {
            // Caso de error
            Swal.fire({
              title: 'Error',
              text: 'Ha ocurrido un error al crear la empresa.',
              confirmButtonColor: buttonColors.confirmationColor,
              icon: 'error',
            });
          }
        );
      } catch (error) {
        console.error('Error al cargar la imagen:', error);
      }
    }else{
       // Caso de error
       Swal.fire({
        position: "top-end",
        text: 'Faltan campos por llenar',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });

      console.log(this.form.errors)
      console.log(this.form_legal.errors)
      console.log(this.form_natural.errors)

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
    this.taxLiabilityService.getTaxLiabilitiesBackend().subscribe(
      (taxLiabilities: TaxLiability[]) => {
        this.taxLiabilitiesList = taxLiabilities;
      },
      (error) => {
        console.error('Error al obtener las obligaciones fiscales', error); 
      }
    );
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
  getDepartments(n: number) {
    this.departmenList = this.departmentService.getListDepartments2(n);
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

  goToListEnterprises(){
    this.router.navigate(['general/enterprises/list']);
  }
}
