import { Component, Inject,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThirdServiceService } from '../../services/third-service.service';
import { Third } from '../../models/Third';
import { ReactiveFormsModule } from '@angular/forms';
import { eTypeId } from '../../models/eTypeId';
import { ePersonType } from '../../models/ePersonType';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ThirdType } from '../../models/ThirdType';
import { TypeId } from '../../models/TypeId';
import { ThirdServiceConfigurationService } from '../../services/third-service-configuration.service';
import Swal from 'sweetalert2';
import { DepartmentService } from '../../services/department.service';
import { Validators } from '@angular/forms';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { CityService } from '../../services/city.service';
import { eThirdGender } from '../../models/eThirdGender';
@Component({
  selector: 'app-third-edit-modal',
  templateUrl: './third-edit-modal.component.html',
  styleUrl: './third-edit-modal.component.css'
})

export class ThirdEditModalComponent implements OnInit {

  inputData: any;
  thirdTypes: ThirdType[] = [];
  typeIds: TypeId[] = [];
  entData: any | null = null;
  button1Checked = false;
  button2Checked = false;
  selectedCountry: any;
  selectedState: any;
  countryCode!: string;
  states: any[] = [];
  selectedThirdTypes: ThirdType[] = [];
  verificationNumber: number | null = null;
  cities: any[] = [];
  selectedcity: any;
  countries: any[] = [];
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  showAdditionalDiv = false;
  thirdData: Third = {
    thId: 0,
    entId: '',
    typeId:  {
      entId: "0",
      typeId: "CC",
      typeIdname: "CC"
    },  // Utiliza uno de los valores definidos en el enum
    thirdTypes: [],       // Array vacío o podrías iniciar con valores predeterminados si aplica
    rutPath: undefined,
    personType: ePersonType.natural,
    names: undefined,
    lastNames: undefined,
    socialReason: undefined,
    gender: undefined,
    idNumber: 0,
    state: false,
    photoPath: undefined,
    country: 0,
    province: 0,
    city: 0,
    address: '',
    phoneNumber: '',
    email: '',
    creationDate: '',
    updateDate: ''
  };
  thirdForm: FormGroup = this.fb.group({
    typeId: [this.thirdData.typeId, Validators.required],
    idNumber: [this.thirdData.idNumber, [Validators.required, Validators.pattern("^[0-9]*$")]],
    personType: [this.thirdData.personType, Validators.required],
    thirdTypes: [this.thirdData.thirdTypes, Validators.required],
    names: [this.thirdData.names, Validators.required],
    lastNames: [this.thirdData.lastNames, Validators.required],
    socialReason: [this.thirdData.socialReason, Validators.required],
    verificationNumber: [this.thirdData.verificationNumber],
    selectedcity: 0,
    gender: [this.thirdData.gender],
    country: [this.thirdData.country, Validators.required],
    province: [this.thirdData.province, Validators.required],
    city: [this.thirdData.city, Validators.required],
    address: [this.thirdData.address, Validators.required],
    phoneNumber: [this.thirdData.phoneNumber, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(7)]],
    email: [this.thirdData.email, [Validators.required, Validators.email]]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private ref: MatDialogRef<ThirdEditModalComponent>, 
    private service: ThirdServiceService, 
    private fb: FormBuilder,  // Correcto
    private thirdServiceConfiguration: ThirdServiceConfigurationService,
    private departmentService: DepartmentService,
    private cityService: CityService
  ) {}
  

  ngOnInit(){
    this.inputData = this.data;
    this.countries = [{ name: 'Colombia', id: 1 }, { name: 'Ecuador', id: 2 }, { name: 'Peru', id: 3 }, { name: 'Venezuela', id: 4 }];
    this.entData = this.localStorageMethods.loadEnterpriseData();
    if(this.inputData.thId > 0){
      this.service.getThirdPartie(this.inputData.thId).subscribe(third => {
        this.thirdData = third;
        console.log('Datos de tercer cargados desde la base de datos:', this.thirdData);
        this.thirdForm = this.fb.group({
          typeId: [this.thirdData.typeId.typeId],
          idNumber: [this.thirdData.idNumber],
          personType: [this.thirdData.personType],
          thirdTypes: [this.thirdData.thirdTypes[0].thirdTypeName],
          names: [this.thirdData.names],
          lastNames: [this.thirdData.lastNames],
          socialReason: [this.thirdData.socialReason],
          verificationNumber: [this.thirdData.verificationNumber],
          gender: [this.thirdData.gender],
          country: [this.thirdData.country],
          province: [this.thirdData.province],
          city: [this.thirdData.city],
          address: [this.thirdData.address],
          phoneNumber: [this.thirdData.phoneNumber],
          email: [this.thirdData.email]
        });
        console.log('El tipo de tercero guardado es:', this.thirdData.thirdTypes);
        this.thirdForm.get('thirdTypes')?.setValue(this.thirdData.thirdTypes);
        const countryName = this.thirdData.country;
        const selectedCountry = this.countries.find(country => country.name === countryName);
        this.thirdForm.get('country')?.setValue(selectedCountry.id);
        if (selectedCountry.id) {
          if (selectedCountry.id === 1) {
            console.log('El pais si es colombia');
            this.states = this.departmentService.getListDepartments();
            const provinceName = this.thirdData.province;
            const selectedprovince = this.states.find(province => province.name === provinceName);
            console.log('El id del departamento es ', selectedprovince);
            this.thirdForm.get('province')?.setValue(selectedprovince.id);
            if (selectedprovince.id) {
              this.getCities(selectedprovince.id)
            } else {
              //console.log('Departamento no encontrado:', ProvinceName);
            }
          } else {
            //this.loadDepartmentsFromBackend(this.selectedCountry.id);
          }
        }
      })
    }
    
    

    this.thirdServiceConfiguration.getThirdTypes(this.entData).subscribe({
      next: (response: ThirdType[]) => {
        this.thirdTypes = response;
        console.log('Tipos de terceros obtenidos:', this.thirdTypes);
      },
      error: (error) => {
        console.log('Error al obtener tipos de terceros:', error);
      }
    });

  this.thirdServiceConfiguration.getTypeIds(this.entData).subscribe({
      next: (response: TypeId[])=>{
        this.typeIds = response;
      },
      error: (error) => {
        console.log(error)
      }
    });

    this.thirdServiceConfiguration.getThirdTypes("0").subscribe({
      next: (response: ThirdType[])=>{
        response.forEach(elemento => this.thirdTypes.push(elemento));
        console.log(this.thirdTypes);
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

  this.thirdServiceConfiguration.getTypeIds("0").subscribe({
      next: (response: TypeId[])=>{
        response.forEach(elemento => this.typeIds.push(elemento));
        console.log(response)
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

  OnSubmit(){
    const currentDate = new Date();
    var third: Third = this.thirdForm.value;
    third.thId = this.thirdData.thId;
    third.entId = this.entData;
    let typeIdValue = this.typeIds.find(typeId => typeId.typeId === this.thirdForm.get('typeId')?.value);
    console.log(typeIdValue)
    let thirdTypeId = this.thirdTypes.find(thirdType=> thirdType.thirdTypeName === this.thirdForm.get("thirdTypes")?.value);
    if(typeIdValue !== null && typeIdValue !== undefined){
      third.typeId = typeIdValue;
    }
    if(thirdTypeId !== null && thirdTypeId !==undefined){
    third.thirdTypes = [thirdTypeId];
  }

  console.log("se envian datos" ,third);

  this.service.UpdateThird(third).subscribe({
    next: (response) => {
      // Handle the successful response here
      console.log('Success:', response);
      Swal.fire({
        title: 'Edicion exitosa!',
        text: 'Se ha creado el producto con éxito!',
        icon: 'success',
      });
    },
    error: (error) => {
      // Handle any errors here
      console.error('Error:', error);
      console.log(third);
      // Mensaje de éxito con alert
      Swal.fire({
        title: 'Error!',
        text: 'Ha Ocurrido Un Erro Al Editar El Tercero!',
        icon: 'error',
      });
    },
  });

  }

  onTypeIdChange(event: any) {
    this.showAdditionalDiv = event.target.value === 'NIT';
  }

  onCheckChange(personType: string) {
    if (personType === 'Juridica') {
      this.thirdForm.get('personType')?.setValue('Juridica');
      this.button1Checked = true;
      this.button2Checked = false;
    } else if (personType === 'Natural') {
      this.thirdForm.get('personType')?.setValue('Natural');
      this.button1Checked = false;
      this.button2Checked = true;
    }
  }

  onCountryChange(event: any) {
    this.selectedCountry = JSON.parse(event.target.value);
    this.countryCode = this.selectedCountry.id;
    this.getDepartments();
  }

  getDepartments() {
    this.states = this.departmentService.getListDepartments();
  }

  onStateChange(event: any) {
    console.log('Se parcean departamentos');
    this.selectedState = JSON.parse(event.target.value)
    console.log('Se parcean departamentos', event.target.value);
    this.getCities(this.selectedState);
  }

  getCities(id: number) {
    this.cityService.getListCitiesByDepartment(id).subscribe((data) => {
      this.cities = data.cities;
      console.log('Las ciudades son:', this.cities); // Muestra la lista de ciudades cargadas
      const cityName = String(this.thirdData.city).trim();
      console.log('El nombre de la ciudad es', cityName);
      this.selectedcity = this.cities.find(city => city.name === cityName);
      console.log('El id de la ciudad es', this.selectedcity);
      this.thirdForm.get('city')?.setValue(this.selectedcity.id);
    });
  }

  updateFormForPersonType(personType: string) {
    if (personType === 'Juridica') {
      this.thirdForm.get('gender')?.disable();
    } else {
      this.thirdForm.get('gender')?.enable();
    }
  }

  updateTypeIds(): void {
    this.thirdServiceConfiguration.getTypeIds(this.entData).subscribe({
      next: (response: TypeId[]) => {
        let filteredTypeIds;
        // Comprobar si button1Checked (Juridica) está activo
        if (this.button1Checked) {
          filteredTypeIds = response.filter(elemento =>
            elemento.typeIdname && elemento.typeIdname.includes('NIT')
          );
        } else {
          filteredTypeIds = response; // Lógica adicional para 'Natural' si es necesario
        }

        // Actualizar el array typeIds
        this.typeIds = filteredTypeIds;

        // Limpiar el valor del campo typeId
        this.thirdForm.get('typeId')?.setValue(''); // Establecer explícitamente como vacío
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

  isSelected(item: any): boolean {
    return this.selectedThirdTypes.some(selected => selected.thirdTypeId === item.thirdTypeId);
  }


  toggleSelection(item: any) {
    if (this.isSelected(item)) {
      this.selectedThirdTypes = this.selectedThirdTypes.filter(selected => selected.thirdTypeId !== item.thirdTypeId);
    } else {
      this.selectedThirdTypes.push(item);
    }
  }

    //Funcion para generar un nuevo digito de verificacion
    private updateVerificationNumber(idNumber: number): void {
      const idNumberStr = idNumber.toString();
      const duplicatedStr = idNumberStr + idNumberStr;
      const duplicatedNumber = parseInt(duplicatedStr, 10);
      const verificationNumber = this.calculateVerificationNumber(idNumberStr);
      this.verificationNumber = verificationNumber;
      this.thirdForm.get('verificationNumber')?.setValue(this.verificationNumber, { emitEvent: false });
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
    if (suma == 0){
      return 0;
    }else if(suma == 1){
      return 1;
    }
    return 11-suma % 11;
  }

    //Monitorea los cambios en el selector de Tipos de tercero
    onThirdTypeSelect(selectedItems: ThirdType[]): void {
      this.selectedThirdTypes = [];
      this.selectedThirdTypes.push(...selectedItems);
      this.thirdForm.get('thirdTypes')?.setValue(this.selectedThirdTypes);
      console.log('Tipos seleccionados actualizados:', this.selectedThirdTypes);
    }

  closePopUp(){
    this.ref.close('closing from modal details');
  }
}
