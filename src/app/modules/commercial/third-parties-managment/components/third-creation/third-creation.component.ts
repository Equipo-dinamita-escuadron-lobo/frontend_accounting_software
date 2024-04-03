import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Third } from '../../models/Third';
import { eThirdGender } from '../../models/eThirdGender';
import { ThirdServiceService } from '../../services/third-service.service';
import { DatePipe } from '@angular/common';
import { Country } from 'country-state-city';
import { State } from 'country-state-city';
import { City } from 'country-state-city';

@Component({
  selector: 'app-third-creation',
  templateUrl: './third-creation.component.html',
  styleUrl: './third-creation.component.css',
  providers: [DatePipe]
})
export class ThirdCreationComponent implements OnInit {

  createdThirdForm!: FormGroup;
  submitted = false;
  button1Checked = true;
  button2Checked = false;
  showAdditionalDiv = false;
  countries: any[] = [];
  states: any[] = [];
  citys: any[]=[];
  countryCode!: string;

  constructor(
    private formBuilder: FormBuilder,
    private thirdService: ThirdServiceService,
    private datePipe: DatePipe
    ){};

  ngOnInit(): void {

    this.createdThirdForm = this.formBuilder.group(
      {
        entId: ["", Validators.required],
        typeId: ["",Validators.required],
        thirdTypes: ["",Validators.required],
        rutPath: [""],
        personType:  ["",Validators.required],
        names: [""],
        lastNames: [""],
        socialReason: [""],
        gender:[""],
        idNumber: ["",Validators.required],
        verificationNumber: [""], 
        state: ["",Validators.required],
        photoPath:[""],
        country: ["",Validators.required],
        province: ["",Validators.required],
        city: ["",Validators.required],
        address: ["",Validators.required],
        phoneNumber: ["",Validators.required], 
        email: ["",Validators.required], 
        creationDate: ["",Validators.required],
        updateDate: ["",Validators.required]

      }
    );

    this.countries = Country.getAllCountries();
  }

  onCountryChange(event: any) {
    this.countryCode = event.target.value;
    this.states = State.getStatesOfCountry(event.target.value);
  }

  onStateChange(event: any) {
    this.citys = City.getCitiesOfState(this.countryCode,event.target.value);
  }

  onTypeIdChange(event: any) {
    this.showAdditionalDiv = event.target.value === "NIT";
  }

OnSubmit(){
  this.submitted = true;
  const currentDate = new Date();
  var third: Third = this.createdThirdForm.value;
  third.entId = 1121;
  third.gender = eThirdGender.masculino;
  third.verificationNumber = 0;
  third.photoPath = "";
  third.creationDate = this.datePipe.transform(currentDate, "yyyy-MM-dd")!;
  third.updateDate = this.datePipe.transform(currentDate, "yyyy-MM-dd")!;
  third.thirdTypes = [this.createdThirdForm.get('thirdTypes')?.value]

  this.thirdService.createThird(third).subscribe({
    next: (response) => {
      // Handle the successful response here
      console.log("Success:", response);
      alert("Success Created Third" + JSON.stringify(this.createdThirdForm.value, null, 4));
    },
    error: (error) => {
      // Handle any errors here
      console.error("Error:", error);
      alert("Failed to create Third.");
    }
  });

  alert("Succes Created Third" + JSON.stringify(this.createdThirdForm.value,null,4));
}

onCheckChange(buttonId: number): void {
  if (buttonId === 1 && this.button1Checked) {
    this.button2Checked = false;
  } else if (buttonId === 2 && this.button2Checked) {
    this.button1Checked = false;
  }
}

OnReset(){
  this.submitted = false;
  this.createdThirdForm.reset();
}

}
