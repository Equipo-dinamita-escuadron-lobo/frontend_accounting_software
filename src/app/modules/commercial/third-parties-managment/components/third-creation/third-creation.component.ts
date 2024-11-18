import { Component, Inject, OnInit, Optional, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Third } from '../../models/Third';
import { Router } from '@angular/router';
import { ThirdServiceService } from '../../services/third-service.service';
import { DatePipe } from '@angular/common';
import { get } from 'jquery';
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { ThirdServiceConfigurationService } from '../../services/third-service-configuration.service';
import { TooltipService } from '../../services/tooltip.service';
import { Tooltip } from '../../models/Tooltip';
import { ThirdType } from '../../models/ThirdType';
import { TypeId } from '../../models/TypeId';
import { CityService } from '../../services/city.service';
import { DepartmentService } from '../../services/department.service';
import { eThirdGender } from '../../models/eThirdGender';
import { catchError, map, Observable, of } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { buttonColors } from '../../../../../shared/buttonColors';


@Component({
  selector: 'app-third-creation',
  templateUrl: './third-creation.component.html',
  styleUrl: './third-creation.component.css',
  providers: [DatePipe],
})

export class ThirdCreationComponent implements OnInit {

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
  
  contendPDFRUT: string | null = null;
  infoThird: string[] | null = null;
  selectedThirdTypes: ThirdType[] = [];
  submitted = false;
  button1Checked = false;
  button2Checked = false;
  showAdditionalDiv = false;
  countries: any[] = [];
  states: any[] = [];
  thirdTypes: ThirdType[] = [];
  typeIds: TypeId[] = [];
  cities: any[] = [];
  countryCode!: string;
  selectedCountry: any;
  selectedState: any;
  selectedCity: any;
  //Digito de verificacion
  verificationNumber: number | null = null;
  //vector para manejar los mensajes de error 
  errorMessages: string[] = [];

  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;
  isDuplicated: boolean = false;

  constructor(
    @Optional() private dialogRef: MatDialogRef<ThirdCreationComponent>,
    private tooltipService: TooltipService,
    private fb: FormBuilder,

    private formBuilder: FormBuilder,
    private thirdService: ThirdServiceService,
    private datePipe: DatePipe,
    private thirdServiceConfiguration: ThirdServiceConfigurationService,
    private Tooltip: TooltipService,
    private cityService: CityService,
    private departmentService: DepartmentService,
    private router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: { destination?: string },
  ) {
    this.initializeForm();
    this.tooltipForm = this.fb.group({
      entId: ['', Validators.required],
      tip: ['', Validators.required]
    });
  }

  
  ngOnInit(): void {
    this.entData = this.localStorageMethods.loadEnterpriseData();
    this.loadTooltips(); // Cargar los tooltips al inicializar el componente
    this.initializeForm();
    this.getCountries();
    this.getTypesID();
    this.getThirdTypes();
    //verificar si se esta creando apartir del PDF del RUT 
    this.contendPDFRUT = this.thirdService.getInfoThirdRUT();
    if (this.contendPDFRUT) {
      this.infoThird = this.contendPDFRUT.split(";");
      console.log("Informacion recibida:", this.infoThird);
      this.thirdService.clearInfoThirdRUT();
      this.initializeFormPDFRUT();
    } else {
      console.log("No se recibe ninguna info PDF RUT");
    }

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


  private initializeForm(): void {
    this.createdThirdForm = this.formBuilder.group({
      entId: [''],
      typeId: ['', Validators.required],
      thirdTypes: ['', Validators.required],
      rutPath: [''],
      personType: ['', Validators.required],
      names: [''],
      lastNames: [''],
      socialReason: [''],
      gender: [null],
      idNumber: ['', { validators: [Validators.required], asyncValidators: [this.idDuplicadoAsyncValidator(this.thirdService)], updateOn: 'blur' }],
      verificationNumber: [{ value: '', disabled: true }],
      state: ['Activo', Validators.required],
      photoPath: [''],
      country: ['', Validators.required],
      province: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], //Validacion requerida para que tenga el formato correcto de correo electronico
      creationDate: [''],
      updateDate: ['']
    });

    this.createdThirdForm.get('idNumber')?.valueChanges.subscribe(value => {
      if (value) {
        this.updateVerificationNumber(value);
      } else {
        this.verificationNumber = null;
      }
    });
  }

  //Cargar datos apartir del PDF del RUT
  private initializeFormPDFRUT(): void {
    if (this.infoThird?.[0].includes("Persona jurídica")) {
      this.button1Checked = true;
      this.button2Checked = false;
      this.createdThirdForm.patchValue({ personType: 'Juridica' });
      this.createdThirdForm.patchValue({ socialReason: this.infoThird?.[3] ?? '' });
    } else {
      this.button1Checked = false;
      this.button2Checked = true;
      this.createdThirdForm.patchValue({ personType: 'Natural' });
      this.createdThirdForm.patchValue({ names: this.infoThird?.[5] ?? '', lastNames: this.infoThird?.[4] ?? '', });
    }
    this.updateValidator();
    this.createdThirdForm.patchValue({
      typeId: this.infoThird?.[1] ?? '',
      address: this.infoThird?.[9] ?? '',
      thirdTypes: '',
      idNumber: this.infoThird?.[2] ?? '',
      email: this.infoThird?.[10] ?? '',
      phoneNumber: this.infoThird?.[11] ?? '',
      country: 's',
      province: '',
      city: ''
    });

    this.selectedCountry = this.countries.find(country => country.name.toLowerCase() === this.infoThird?.[6]?.toLowerCase());
    this.createdThirdForm.patchValue({ country: this.selectedCountry.id });
    this.countryCode = this.selectedCountry.id;
    this.getDepartments(1);
    this.selectedState = this.states.find(state => state.name.toLowerCase() === this.infoThird?.[7].toLowerCase());
    this.createdThirdForm.patchValue({ province: this.selectedState.id });
    this.getCities(this.selectedState.id);
    this.createdThirdForm.patchValue({ city: this.infoThird?.[8] ?? '' });
    this.onTypeIdChange2(this.infoThird?.[1] ?? '');
  }

  private getCountries(): void {
    this.countries = [{ name: 'Colombia', id: 1 }, { name: 'Extranjero', id: 2 }];
    //this.countries = [{ name: 'Colombia', id: 1 }];
  }

  private getTypesID(): void {
    this.thirdServiceConfiguration.getTypeIds(this.entData).subscribe({
      next: (response: TypeId[]) => {
        this.typeIds = response;
      },
      error: (error) => {
        console.log(error)
        Swal.fire({
          title: 'Error',
          text: 'No se han encontrado Tipos De Identifiacion Para esta Empresa',
          icon: 'error',
          confirmButtonColor: buttonColors.confirmationColor,
        });
      }
    });
  }

  private getThirdTypes(): void {
    this.thirdServiceConfiguration.getThirdTypes(this.entData).subscribe({
      next: (response: ThirdType[]) => {
        this.thirdTypes = response;
      },
      error: (error) => {
        console.log(error)
        Swal.fire({
          title: 'Error',
          text: 'No se han encontrado Tipos De Tercero Para esta Empresa',
          icon: 'error',
          confirmButtonColor: buttonColors.confirmationColor,
        });
      }
    });
  }

  //Monitorea los cambios en el selector de Tipos de tercero
  onThirdTypeSelect(selectedItems: ThirdType[]): void {
    this.selectedThirdTypes = [];
    this.selectedThirdTypes.push(...selectedItems);
    this.createdThirdForm.get('thirdTypes')?.setValue(this.selectedThirdTypes);
    console.log('Tipos seleccionados actualizados:', this.selectedThirdTypes);
  }


  //Funcion para generar un nuevo digito de verificacion
  private updateVerificationNumber(idNumber: number): void {
    const idNumberStr = idNumber.toString();
    const duplicatedStr = idNumberStr + idNumberStr;
    const duplicatedNumber = parseInt(duplicatedStr, 10);
    const verificationNumber = this.calcularDigitoVerificacion(idNumberStr);
    this.verificationNumber = verificationNumber;
    this.createdThirdForm.get('verificationNumber')?.setValue(this.verificationNumber, { emitEvent: false });
  }

  private calcularDigitoVerificacion(numero: string): number {
    const pesos = [71, 67, 59, 53, 47, 43, 41, 37, 29, 23, 19, 17, 13, 7, 3];
    const numeroFormateado = numero.padStart(15, '0');
    let suma = 0;
    for (let i = 0; i < 15; i++) {
      suma += parseInt(numeroFormateado.charAt(i)) * pesos[i];
    }
    const residuo = suma % 11;
    let digitoVerificacion;
    if (residuo === 0) {
      digitoVerificacion = 0;
    } else if (residuo === 1) {
      digitoVerificacion = 1;
    } else {
      digitoVerificacion = 11 - residuo;
    }
    return digitoVerificacion;
  }

  //seleccion entre colombia o extranjero 
  onCountryChange(event: any) {

    const id_country = JSON.parse(event.target.value);
    this.selectedCountry = this.countries.find(country => country.id === id_country);
    console.log(this.selectedCountry);
    this.countryCode = this.selectedCountry.id;
    if (this.countries.find(country => country.id === id_country).name === 'Colombia') {
      this.getDepartments(1);
      this.getCities(this.selectedState.id);
    } else {
      this.getDepartments(2);
      this.getCities(33);
    }
  }

  onStateChange(event: any) {
    const id_state = JSON.parse(event.target.value);
    this.selectedState = this.states.find(state => state.id == id_state);
    console.log(this.selectedState);
    this.getCities(this.selectedState.id);
  }

  getCities(id: number) {
    this.cityService.getListCitiesByDepartment(id).subscribe((data) => {
      this.cities = data.cities;
    });
  }

  getDepartments(id: number) {
    this.states = this.departmentService.getDepartmentById(id);
  }

  onTypeIdChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;//Obtenemos el valor del evento
    if (value.includes('NIT')) {
      console.log("tipo ID", value, " Se genera digito de verificacion");
      this.createdThirdForm.get('verificationNumber')?.enable();
    } else {
      console.log("No se genera digito de verificacion");
      this.createdThirdForm.get('verificationNumber')?.disable();
    }
  }

  onTypeIdChange2(value: string): void {
    if (value.includes('NIT')) {
      console.log("tipo ID", value, " Se genera digito de verificacion");
      this.createdThirdForm.get('verificationNumber')?.enable();
    } else {
      console.log("No se genera digito de verificacion");
      this.createdThirdForm.get('verificationNumber')?.disable();
    }
  }

  goToListThirds(): void {
    if (this.data && this.data.destination === 'destination') {
      this.dialogRef?.close('close'); // Usar el operador de acceso opcional para dialogRef
    } else {
      this.router.navigateByUrl('/general/operations/third-parties');
    }
  }

  //validar campos obligatorios para persona Juridica(Razon Social) y Natural (Nombre y Apellidos)
  updateValidator() {
    if (this.button1Checked) {
      this.createdThirdForm.get('socialReason')?.setValidators([Validators.required]);
    } else {
      this.createdThirdForm.get('socialReason')?.clearValidators();
    }

    if (this.button2Checked) {
      this.createdThirdForm.get('names')?.setValidators([Validators.required]);
      this.createdThirdForm.get('lastNames')?.setValidators([Validators.required]);
      this.createdThirdForm.get('gender')?.setValidators([Validators.required]);
    } else {
      this.createdThirdForm.get('names')?.clearValidators();
      this.createdThirdForm.get('lastNames')?.clearValidators();
      this.createdThirdForm.get('gender')?.clearValidators();
    }
    this.createdThirdForm.get('socialReason')?.updateValueAndValidity();
    this.createdThirdForm.get('names')?.updateValueAndValidity();
    this.createdThirdForm.get('lastNames')?.updateValueAndValidity();
    this.createdThirdForm.get('gender')?.updateValueAndValidity();
  }

  onCheckChange(buttonId: number): void {
    if (buttonId === 1 && this.button1Checked) {
      this.button2Checked = false;
      this.createdThirdForm.get('names')?.setValue('');
      this.createdThirdForm.get('lastNames')?.setValue('');
      this.createdThirdForm.get('verificationNumber')?.disable();
    } else if (buttonId === 2 && this.button2Checked) {
      this.button1Checked = false;
      this.createdThirdForm.get('socialReason')?.setValue('');
      this.createdThirdForm.get('verificationNumber')?.disable();

    }
    this.updateValidator();
    this.updateTypeIds();
  }

  updateTypeIds(): void {
    this.thirdServiceConfiguration.getTypeIds(this.entData).subscribe({
      next: (response: TypeId[]) => {
        let filteredTypeIds;
        if (this.button1Checked) {
          filteredTypeIds = response.filter(elemento =>
            elemento.typeIdname && elemento.typeIdname.includes('NIT')
          );
        } else {
          filteredTypeIds = response;
        }
        this.typeIds = filteredTypeIds;
        this.createdThirdForm.get('typeId')?.setValue('');
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error',
          text: 'No se han encontrado Tipos De Identificación Para esta Empresa',
          icon: 'error',
          confirmButtonColor: buttonColors.confirmationColor,
        });
      }
    });
  }

  //Manejo de errores, campos rqueridos
  private getFormErrors(): string[] {
    const errors = [];
    const controls = this.createdThirdForm.controls;

    // Verificar si el formulario fue enviado
    if (this.submitted) {
      for (const name in controls) {
        const control = controls[name];

        if (control.invalid) {
          // Si el control es requerido y esta vacio
          if (control.errors?.['required']) {
            switch (name) {
              case 'typeId':
                errors.push(`Seleccione un Tipo de Identificacion`);
                break;
              case 'thirdTypes':
                errors.push(`Seleccione al menos un Tipo de Tercero`);
                break;
              case 'personType':
                errors.push(`Seleccione un Tipo de Persona`);
                break;
              case 'idNumber':
                errors.push(`Ingrese un Numero de Identificacion`);
                break;
              case 'country':
                errors.push(`Seleccione un Pais`);
                break;
              case 'province':
                errors.push(`Seleccione un Departamento`);
                break;
              case 'city':
                errors.push(`Seleccione una Ciudad`);
                break;
              case 'address':
                errors.push(`Ingrese una Direccion `);
                break;
              case 'phoneNumber':
                errors.push(`Ingrese un numero de Celular`);
                break;
              case 'email':
                errors.push(`Ingrese un Correo Electronico`);
                break;
              case 'state':
                errors.push(`Seleccione un estado`);
                break;
              case 'names':
                errors.push(`Ingrese un Nombre`);
                break;
              case 'lastNames':
                errors.push(`Ingrese un Apellido`);
                break;
              case 'socialReason':
                errors.push(`Ingrese una Razon Social`);
                break;

              case 'gender':
                errors.push(`Seleccione un Genero`);
                break;
              default:
                errors.push(`${name} es requerido`);
            }
          }

          // Validación del formato de correo electrónico
          if (control.errors?.['email']) {
            errors.push(`El fromato del Correo Electronico es Invalido`);
          }
          //validacion id duplicado
          if (control.errors?.['idDuplicado']) {
            errors.push(`El Número de Identificación ya existe`);
          }
        }
      }
    }

    return errors;
  }

  idDuplicadoAsyncValidator(thirdService: ThirdServiceService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return thirdService.existThird(control.value, this.entData).pipe(
        map((isDuplicated: any) => (isDuplicated ? { idDuplicado: true } : null)),
        catchError(() => of(null)) // Manejar errores del servicio
      );
    };
  }

  OnSubmit() {
    this.submitted = true;
    // Verifica si el formulario es valido
    if (this.createdThirdForm.invalid) {
      this.errorMessages = this.getFormErrors(); // Obtener los errores
      // Mostrar alerta con los errores
      Swal.fire({
        title: 'Errores en el formulario',
        html: `<ul>${this.errorMessages.map(error => `<li>${error}</li>`).join('')}</ul>`,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: buttonColors.confirmationColor
      });
      return;
    }
    const currentDate = new Date();
    var third: Third = this.createdThirdForm.value;
    third.city = this.createdThirdForm.get('city')?.value;
    third.country = this.selectedCountry.name;
    third.province = this.selectedState.name;
    third.entId = this.entData;
    third.thirdTypes = this.selectedThirdTypes;
    third.state = this.createdThirdForm.get('state')?.value === 'Activo' ? true : false;
    third.photoPath = '';
    third.creationDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd')!;
    third.updateDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd')!;
    let typeIdValue = this.typeIds.find(typeId => typeId.typeId === this.createdThirdForm.get('typeId')?.value);
    if (typeIdValue !== null && typeIdValue !== undefined) {
      third.typeId = typeIdValue;
    }
    if (third.typeId.typeIdname.includes('NIT')) {
      third.verificationNumber = this.verificationNumber?.valueOf();
      console.log('Digito de Verificacion', third.verificationNumber);
    }
    console.log("Dtaos tercero a crear", third);
    this.thirdService.createThird(third).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Creación exitosa',
          text: 'Se ha creado el Tercero con Exito!',
          icon: 'success',
          confirmButtonColor: buttonColors.confirmationColor,
        });
        if (this.data && this.data.destination === 'destination') {
          this.dialogRef?.close('close'); // Usar el operador de acceso opcional para dialogRef
        } else {
          this.goToListThirds();
        }
      },
      error: (error) => {
        console.log('Error', error);
        this.errorMessages = this.getFormErrors();
      },
    });
  }

  OnReset() {
    this.submitted = false;
    this.button2Checked = false;
    this.button1Checked = false;
    this.createdThirdForm.reset();
  }
}