import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Third } from '../../models/Third';
import { Router } from '@angular/router';
import { ThirdServiceService } from '../../services/third-service.service';
import { DatePipe } from '@angular/common';
import { get } from 'jquery';
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { ThirdServiceConfigurationService } from '../../services/third-service-configuration.service';
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
  
  //aaaaaaaaaaaaaaaaaaaaaaaaaaa
  mousePosition = { x: 0, y: 0 }; // Posición del mouse
  positionInicial = { x: 0, y: 0 }; // Posición inicial del mouse
  helpTexts: { [key: string]: string } = {}; // Almacena los textos de ayuda
  editingHelp: string | null = null; // Para rastrear qué cuadro está en edición
  visibleHelp: string | null = null; // Para rastrear cuál cuadro es visible

  updateHelpText(helpId: string, value: string): void {
    this.helpTexts[helpId] = value; // Actualiza el texto de ayuda
  }

  showHelp(helpId: string): void {
    this.visibleHelp = helpId; // Muestra el cuadro de ayuda
  }

  hideHelp(helpId: string): void {
    if (this.editingHelp !== helpId) {
      this.visibleHelp = null; // Oculta el cuadro de ayuda
      this.stopEditing(); // Cierra la edición si no se está editando
    }
  }

  toggleHelp(helpId: string, event: MouseEvent): void {
    if (this.editingHelp === helpId) {
      this.stopEditing(); // Cierra el cuadro si ya está editando
    } else {
      this.setEditing(helpId, event); // Abre el cuadro para edición
    }
  }

  setEditing(helpId: string, event: MouseEvent): void {
    this.editingHelp = helpId; // Establece el cuadro actual en edición
    this.visibleHelp = helpId; // Mantiene el cuadro visible mientras se edita
    this.mousePosition = { x: event.clientX +10, y: event.clientY +10 }; 
    /*if (this.mousePosition.x === this.positionInicial.x) { // Captura la posición del mouse
      this.mousePosition = {
        x: event.clientX + 10,
        y: event.clientY + 10
      };
    }*/
    
  }

  stopEditing(): void {
    this.editingHelp = null; // Salir del modo de edición
    this.visibleHelp = null;
    localStorage.setItem('helpTexts', JSON.stringify(this.helpTexts)); // Guarda los textos de ayuda en el almacenamiento local
  }

  isEditing(helpId: string): boolean {
    return this.editingHelp === helpId; // Retorna si el cuadro está en edición
  }

  isHelpVisible(helpId: string): boolean {
    return this.visibleHelp === helpId || this.isEditing(helpId); // Muestra el cuadro si está visible o en edición
  }
  noisHelpVisible(helpId: string): boolean {
    return this.isEditing(helpId); // No Muestra el cuadro si está visible, solo en edición
  }

  contendPDFRUT: string | null = null;
  infoThird: string[] | null = null;
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
  selectedCity:any;
  //Digito de verificacion
  verificationNumber: number | null = null;
  //vector para manejar los mensajes de error 
  errorMessages: string[] = [];

  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;
  isDuplicated: boolean = false;

  constructor(
    @Optional() private dialogRef: MatDialogRef<ThirdCreationComponent>,
    private formBuilder: FormBuilder,
    private thirdService: ThirdServiceService,
    private datePipe: DatePipe,
    private thirdServiceConfiguration: ThirdServiceConfigurationService,
    private cityService: CityService,
    private departmentService: DepartmentService,
    private router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: { destination?: string },
  ) { }

  ngOnInit(): void {
    this.entData = this.localStorageMethods.loadEnterpriseData();
    this.initializeForm();
    this.getCountries();
    this.getTypesID();
    this.getThirdTypes();
    //verificar si se esta creando apartir del PDF del RUT 
    this.contendPDFRUT = this.thirdService.getInfoThirdRUT(); 
    if (this.contendPDFRUT) {
      this.infoThird = this.contendPDFRUT.split(";");
      console.log("eppaaaaaaaaaaaa Información recibida:", this.infoThird);
      this.thirdService.clearInfoThirdRUT();
      this.initializeFormPDFRUT();
    } else {
      console.log("No se recibe ninguna info PDF RUT");
    }

    // Cargar textos de ayuda del almacenamiento local al iniciar
    const savedHelpTexts = localStorage.getItem('helpTexts');
    if (savedHelpTexts) {
      this.helpTexts = JSON.parse(savedHelpTexts);
    }
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
      idNumber: ['', {validators: [Validators.required], asyncValidators:[this.idDuplicadoAsyncValidator(this.thirdService)], updateOn: 'blur'}],
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
    if(this.infoThird?.[0].includes("Persona jurídica")){
      this.button1Checked = true;
      this.button2Checked = false;
      this.createdThirdForm.patchValue({personType: 'Juridica'});
      this.createdThirdForm.patchValue({socialReason:this.infoThird?.[3] ?? ''});
    }else{
      this.button1Checked = false;
      this.button2Checked = true;
      this.createdThirdForm.patchValue({personType: 'Natural'});
      this.createdThirdForm.patchValue({names:this.infoThird?.[5] ?? '',lastNames:this.infoThird?.[4] ?? '',});
    }
    this.updateValidator();
    this.createdThirdForm.patchValue({
      typeId:this.infoThird?.[1] ?? '',
      address:this.infoThird?.[9] ?? '',
      thirdTypes:'',
      idNumber:this.infoThird?.[2] ?? '',
      email:this.infoThird?.[10] ?? '',
      phoneNumber:this.infoThird?.[11] ?? '',
      country:'s',
      province:'',
      city:''
    });
    
    this.selectedCountry = this.countries.find(country => country.name.toLowerCase() === this.infoThird?.[6]?.toLowerCase());
    this.createdThirdForm.patchValue({country: this.selectedCountry.id});
    this.countryCode = this.selectedCountry.id;
    this.getDepartments();
    this.selectedState = this.states.find(state => state.name.toLowerCase() === this.infoThird?.[7].toLowerCase());
    this.createdThirdForm.patchValue({province: this.selectedState.id});
    this.getCities(this.selectedState.id);
    this.createdThirdForm.patchValue({city: this.infoThird?.[8] ?? ''});
    this.onTypeIdChange2(this.infoThird?.[1] ?? '');
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
    this.selectedState = JSON.parse(event.target.value);
    console.log("nombreee"+this.selectedState);
    this.getCities(this.selectedState);
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
      return thirdService.existThird(control.value).pipe(
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
    third.country = this.countries[this.selectedCountry - 1].name;
    third.province = this.states[this.selectedState - 1].name;
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