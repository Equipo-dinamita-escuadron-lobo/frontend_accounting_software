import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThirdServiceService } from '../../services/third-service.service';
import { Third } from '../../models/Third';
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
import { buttonColors } from '../../../../../shared/buttonColors';
import { CityService } from '../../services/city.service';
import { eThirdGender } from '../../models/eThirdGender';
@Component({
  selector: 'app-third-edit-modal',
  templateUrl: './third-edit-modal.component.html',
  styleUrl: './third-edit-modal.component.css'
})
export class ThirdEditModalComponent {

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
  cities: any[] = [];
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
    verificationNumber: undefined,
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
    gender: [this.thirdData.gender],
    country: [this.thirdData.country, Validators.required],
    province: [this.thirdData.province, Validators.required],
    city: [this.thirdData.city, Validators.required],
    address: [this.thirdData.address, Validators.required],
    phoneNumber: [this.thirdData.phoneNumber, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(7)]],
    email: [this.thirdData.email, [Validators.required, Validators.email]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private ref:MatDialogRef<ThirdEditModalComponent>, private service:ThirdServiceService, private fb:FormBuilder,private thirdServiceConfiguration: ThirdServiceConfigurationService,private departmentService: DepartmentService,private cityService: CityService,){

  }

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


        const countryId = Number(this.thirdData.country);
        this.thirdForm.get('country')?.setValue(countryId);
        if (countryId) {
          if (countryId === 1) {
            console.log('El pais si es colombia');
            this.states = this.departmentService.getListDepartments();
            const provinceId = Number(this.thirdData.province);
            this.thirdForm.get('province')?.setValue(provinceId);
            if (provinceId) {
              this.getCities(provinceId)
              console.log('el departamento ID es', provinceId);
              // Cargar las ciudades correspondientes al departamento
              const cityId = Number(this.thirdData.city);
              this.thirdForm.get('city')?.setValue(cityId);

              console.log('el id de ciudad es:', cityId); // Muestra la lista de ciudades cargadas


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
          confirmButtonColor: buttonColors.confirmationColor,
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
          confirmButtonColor: buttonColors.confirmationColor,
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
        confirmButtonColor: buttonColors.confirmationColor,
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
        confirmButtonColor: buttonColors.confirmationColor,
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

  closePopUp(){
    this.ref.close('closing from modal details');
  }
}
