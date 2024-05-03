import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Third } from '../../models/Third';
import { eThirdGender } from '../../models/eThirdGender';
import { ThirdServiceService } from '../../services/third-service.service';
import { DatePipe } from '@angular/common';
import { Country } from 'country-state-city';
import { State } from 'country-state-city';
import { City } from 'country-state-city';
import { get } from 'jquery';
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { ThirdServiceConfigurationService } from '../../services/third-service-configuration.service';
import { ThirdType } from '../../models/ThirdType';
import { TypeId } from '../../models/TypeId';

@Component({
  selector: 'app-third-creation',
  templateUrl: './third-creation.component.html',
  styleUrl: './third-creation.component.css',
  providers: [DatePipe],
})
export class ThirdCreationComponent implements OnInit {
  createdThirdForm!: FormGroup;
  submitted = false;
  button1Checked = false;
  button2Checked = false;
  showAdditionalDiv = false;
  countries: any[] = [];
  states: any[] = [];
  citys: any[] = [];
  thirdTypes: ThirdType[] = [];
  typeIds: TypeId[] = [];
  countryCode!: string;

  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private thirdService: ThirdServiceService,
    private datePipe: DatePipe,
    private thirdServiceConfiguration: ThirdServiceConfigurationService
  ) {}

  ngOnInit(): void {

    this.entData = this.localStorageMethods.loadEnterpriseData();

    this.createdThirdForm = this.formBuilder.group({
      entId: [''],
      typeId: ['', Validators.required],
      thirdTypes: ['', Validators.required],
      rutPath: [''],
      personType: ['', Validators.required],
      names: [''],
      lastNames: [''],
      socialReason: [''],
      gender: [''],
      idNumber: ['', Validators.required],
      verificationNumber: [''],
      state: [''],
      photoPath: [''],
      country: ['', Validators.required],
      province: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.required],
      creationDate: [''],
      updateDate: [''],
    });

    this.countries = Country.getAllCountries();

    this.thirdServiceConfiguration.getThirdTypes(this.entData.entId).subscribe({
      next: (response: ThirdType[])=>{
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
        
  this.thirdServiceConfiguration.getTypeIds(this.entData.entId).subscribe({
      next: (response: TypeId[])=>{
        this.typeIds = response;
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
        console.log(this.typeIds)
        
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

  onCountryChange(event: any) {
    this.countryCode = event.target.value;
    this.states = State.getStatesOfCountry(event.target.value);
  }

  onStateChange(event: any) {
    this.citys = City.getCitiesOfState(this.countryCode, event.target.value);
  }

  onTypeIdChange(event: any) {
    this.showAdditionalDiv = event.target.value === 'NIT';
  }

  OnSubmit() {
    this.submitted = true;
    const currentDate = new Date();
    var third: Third = this.createdThirdForm.value;
    third.entId = this.entData.entId;
    third.state =
      this.createdThirdForm.get('state')?.value === 'Activo' ? true : false;
    third.photoPath = '';
    third.creationDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd')!;
    third.updateDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd')!;
    let typeIdValue = this.typeIds.find(typeId => typeId.typeId === this.createdThirdForm.get('typeId')?.value);
    let thirdTypeId = this.thirdTypes.find(thirdType=> thirdType.thirdTypeName === this.createdThirdForm.get("thirdTypes")?.value);
    if(typeIdValue !== null && typeIdValue !== undefined){
      third.typeId = typeIdValue;
    }
    if(thirdTypeId !== null && thirdTypeId !==undefined){
    third.thirdTypes = [thirdTypeId];
  }

  console.log(third);

    this.thirdService.createThird(third).subscribe({
      next: (response) => {
        // Handle the successful response here
        console.log('Success:', response);
        Swal.fire({
          title: 'Creación exitosa!',
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
          text: 'Ha Ocurrido Un Erro Al Crear El Tercero!',
          icon: 'error',
        });
      },
    });
  }

  onCheckChange(buttonId: number): void {
    if (buttonId === 1 && this.button1Checked) {
      this.button2Checked = false;
    } else if (buttonId === 2 && this.button2Checked) {
      this.button1Checked = false;
    }
  }

  OnReset() {
    this.submitted = false;
    this.createdThirdForm.reset();
  }
}
