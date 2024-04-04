import { Component } from '@angular/core';
import { ThirdService } from '../../services/third-service';
import { Third } from '../../models/Third';
import { ThirdServiceService } from '../../services/third-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-thirds-list',
  templateUrl: './thirds-list.component.html',
  styleUrls: ['./thirds-list.component.css']
})
export class ThirdsListComponent {
  form: FormGroup;
  data: Third[] = [];
  columns: any[] = [
     // { title: 'Id', data: 'entId' },
     { title: 'Identificación', data: 'idNumber' },
    { title: 'Nombres', data: 'names' },
    { title: 'Apellidos', data: 'lastNames' },
    { title: 'Razón Social', data: 'socialReason' },
    { title: 'Tipo Id', data: 'typeId' },
   // { title: 'DV', data: 'verificationNumber' },
   // { title: 'Estado', data: 'state' },
    //{ title: 'Pais', data: 'country' },
    //{ title: 'Departamento', data: 'province' },
    //{ title: 'Ciudad', data: 'city' },
    //{ title: 'Direccion', data: 'address' },
    { title: 'Celular', data: 'phoneNumber' },
    { title: 'Correo', data: 'email' },
  ];

  constructor(private thirdService: ThirdServiceService,private fb: FormBuilder,private router: Router ) {
    this.form = this.fb.group(this.validationsAll());
  }

  validationsAll(){
    return {
      stringSearch: ['']
    };
  }

  ngOnInit() {
    this.thirdService.getThirdParties("1121",0).subscribe({
      next: (response: Third[])=>{
        console.log(response)
        this.data = response;
      },
      error: (error) => {
        console.log(error)
        alert("Failed to get Thirds")
      }
  });
    
  }

  redirectTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
