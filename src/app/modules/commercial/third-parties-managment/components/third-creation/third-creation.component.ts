import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private thirdService: ThirdServiceService,
    private datePipe: DatePipe,
    private thirdServiceConfiguration: ThirdServiceConfigurationService,
    private cityService: CityService,
    private departmentService: DepartmentService,
    private router: Router,
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

    this.countries = [ {name: 'Colombia', id: 1}, {name: 'Ecuador', id: 2}, {name: 'Peru', id: 3}, {name: 'Venezuela', id: 4}];

    this.thirdServiceConfiguration.getThirdTypes(this.entData).subscribe({
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

    this.thirdServiceConfiguration.getTypeIds(this.entData).subscribe({
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

  onTypeIdChange(event: any) {
    this.showAdditionalDiv = event.target.value === 'NIT';
  }

  OnSubmit() {
    this.submitted = true;
    const currentDate = new Date();
    var third: Third = this.createdThirdForm.value;
    third.city = this.createdThirdForm.get('city')?.value;
    third.country = this.selectedCountry.name;
    third.city = this.selectedState.name;
    third.entId = this.entData;
    third.thirdTypes = this.selectedThirdTypes;

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

    this.thirdService.createThird(third).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Creación exitosa!',
          text: 'Se ha creado el producto con éxito!',
          icon: 'success',
        });
        this.OnReset()
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

  goToListThirds():void{
    this.router.navigateByUrl('/general/operations/third-parties');
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
