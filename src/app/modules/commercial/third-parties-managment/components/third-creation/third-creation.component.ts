import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Third } from '../../models/Third';
import { Router } from '@angular/router';
import { ThirdServiceService } from '../../services/third-service.service';
import { DatePipe } from '@angular/common';
import { get, map } from 'jquery';
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { ThirdServiceConfigurationService } from '../../services/third-service-configuration.service';
import { ThirdType } from '../../models/ThirdType';
import { TypeId } from '../../models/TypeId';
import { CityService } from '../../services/city.service';
import { DepartmentService } from '../../services/department.service';
import { eThirdGender } from '../../models/eThirdGender';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-third-creation',
  templateUrl: './third-creation.component.html',
  styleUrl: './third-creation.component.css',
  providers: [DatePipe],
})
export class ThirdCreationComponent implements OnInit {
  selectedThirdTypes: ThirdType[] = [];
  createdThirdForm!: FormGroup;
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
  idNumber: number | null = null;
  //Digito de verificacion
  verificationNumber: number | null = null;
  //vector para manejar los mensajes de error 
  errorMessages: string[] = [];

  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;
  idUnique: boolean | null = null;
  

  constructor(
    private formBuilder: FormBuilder,
    private thirdService: ThirdServiceService,
    private datePipe: DatePipe,
    private thirdServiceConfiguration: ThirdServiceConfigurationService,
    private cityService: CityService,
    private departmentService: DepartmentService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.entData = this.localStorageMethods.loadEnterpriseData();
    this.initializeForm();
    this.getCountries();
    this.getTypesID();
    this.getThirdTypes();

  }

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
      idNumber: [null, {
        validators: [Validators.required],
        asyncValidators: [(control: AbstractControl) => {
          //console.log('valor del campo: '  + control.value);

          if (!control.value) {
            return Promise.resolve(null); // No validar si el campo está vacío
          }
          return this.checkId(control.value).then(isUnique => {
            return isUnique ? null : { notUnique: true };
          });
        }],
        updateOn: 'blur' // Para que la validación asíncrona se ejecute al perder el foco
      }],
      verificationNumber: [{ value: '', disabled: true }],
      state: ['', Validators.required],
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

    this.createdThirdForm.get('idNumber')?.valueChanges.pipe(
       // Espera 300ms después de que el usuario deja de escribir
      distinctUntilChanged()
    ).subscribe(value => {
      if (value) {
        this.checkId(value).then(isUnique => {
          //console.log('Valor de unique:  ', isUnique);

          if (!isUnique) {
            this.createdThirdForm.get('idNumber')?.setErrors({ notUnique: true });
          } else {
            this.createdThirdForm.get('idNumber')?.setErrors(null);
          }
        });
        this.updateVerificationNumber(value);
      } else {
        this.verificationNumber = null;
      }
    });
  }
  // Método para verificar si el ID es único
  checkId(id: number): Promise<boolean> {
    if (id == null) {
      return Promise.resolve(false);
    }
    return this.thirdService.existThird(id).toPromise().then(isUnique => {
      return isUnique !== undefined ? isUnique : false;
    });
  }

  private getCountries(): void {
    //this.countries = [ {name: 'Colombia', id: 1}, {name: 'Ecuador', id: 2}, {name: 'Peru', id: 3}, {name: 'Venezuela', id: 4}];
    this.countries = [{ name: 'Colombia', id: 1 }];
  }

  private getTypesID(): void {
    this.thirdServiceConfiguration.getTypeIds(this.entData).subscribe({
      next: (response: TypeId[]) => {
        this.typeIds = response;
      },
      error: (error) => {
        console.log(error)
        Swal.fire({
          title: 'Error!',
          text: 'No se han encontrado Tipos De Identifiacion Para esta Empresa',
          icon: 'error',
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
          title: 'Error!',
          text: 'No se han encontrado Tipos De Tercero Para esta Empresa',
          icon: 'error',
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
    const verificationNumber = this.calculateVerificationNumber(idNumberStr);
    this.verificationNumber = verificationNumber;
    this.createdThirdForm.get('verificationNumber')?.setValue(this.verificationNumber, { emitEvent: false });
  }

  // Función para calcular el numero de verificación
  private calculateVerificationNumber(input: string): number {
    const numero = input.padStart(15, '0');
    let suma = 0;
    const pesos = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
    for (let i = 0; i < 15; i++) {
      const digito = parseInt(numero[14 - i]);
      suma += digito * pesos[i];
    }
    if (suma == 0) {
      return 0;
    } else if (suma == 1) {
      return 1;
    }
    return 11 - suma % 11;
  }


  onCountryChange(event: any) {
    this.selectedCountry = JSON.parse(event.target.value);
    this.countryCode = this.selectedCountry.id;
    this.getDepartments();
  }

  onStateChange(event: any) {
    this.selectedState = JSON.parse(event.target.value)
    this.getCities(this.selectedState.id);
  }

  getCities(id: number) {
    this.cityService.getListCitiesByDepartment(id).subscribe((data) => {
      this.cities = data.cities;
    });
  }

  getDepartments() {
    this.states = this.departmentService.getListDepartments();
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

  goToListThirds(): void {
    this.router.navigateByUrl('/general/operations/third-parties');
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
          title: 'Error!',
          text: 'No se han encontrado Tipos De Identificación Para esta Empresa',
          icon: 'error',
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
          // Validación de ID único
          if (control.errors?.['notUnique']) {
            errors.push(`El Número de Identificación ya existe`);
          }
        }
      }
    }

    return errors;
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
        confirmButtonText: 'Aceptar'
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
    this.thirdService.createThird(third).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Creación exitosa!',
          text: 'Se ha creado el tercero con éxito!',
          icon: 'success',
        });
        this.goToListThirds();
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

  toggleSelection(item: any) {
    if (this.isSelected(item)) {
      this.selectedThirdTypes = this.selectedThirdTypes.filter(selected => selected.thirdTypeId !== item.thirdTypeId);
    } else {
      this.selectedThirdTypes.push(item);
    }
  }

  isSelected(item: any): boolean {
    return this.selectedThirdTypes.some(selected => selected.thirdTypeId === item.thirdTypeId);
  }
}
