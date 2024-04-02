import { Component } from '@angular/core';
import { ThirdService } from '../../services/third-service';
import { Third } from '../../models/Third';
import { ThirdServiceService } from '../../services/third-service.service';
@Component({
  selector: 'app-thirds-list',
  templateUrl: './thirds-list.component.html',
  styleUrls: ['./thirds-list.component.css']
})
export class ThirdsListComponent {
  data: Third[] = [];
  columns: any[] = [
      { title: 'Id', data: 'entId' },
    { title: 'Nombres', data: 'names' },
    { title: 'Apellidos', data: 'lastNames' },
    { title: 'Razón Social', data: 'socialReason' },
    { title: 'Tipo Id', data: 'typeId' },
    { title: 'Identificación', data: 'idNumber' },
    { title: 'DV', data: 'verificationNumber' },
    { title: 'Estado', data: 'state' },
    { title: 'Pais', data: 'country' },
    { title: 'Departamento', data: 'province' },
    { title: 'Ciudad', data: 'city' },
    { title: 'Direccion', data: 'address' },
    { title: 'Celular', data: 'phoneNumber' },
    { title: 'Correo', data: 'email' },
  ];

  constructor(private thirdService: ThirdServiceService) {}

  ngOnInit() {
    this.thirdService.getThirdParties().subscribe({
      next: (response: Third[])=>{
        this.data = response;
      },
      error: (error) => {
        console.log(error)
        alert("Failed to get Thirds")
      }
  });
    
  }
}
