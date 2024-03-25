import { Component } from '@angular/core';
import { ThirdService } from '../../services/third-service';
import { Third } from '../../models/third-model';
@Component({
  selector: 'app-thirds-list',
  templateUrl: './thirds-list.component.html',
  styleUrls: ['./thirds-list.component.css']
})
export class ThirdsListComponent {
  data: Third[] = [];
  columns: any[] = [
    {title: 'Id', data: 'id'},
    {title:'Nombres',data:'nombres'},
    {title:'Apellidos',data:'apellidos'},
    {title:'Razón Social',data:'razonSocial'},
    {title:'Tipo Id',data:'tipoIdentificacion'},
    {title:'Identificación',data:'numeroIdentificacion'},
    {title:'DV',data:'digitoVerificacion'},
    {title:'Estado',data:'estado'},
    {title:'Pais',data:'pais'},
    {title:'Departamento',data:'departamento'},
    {title:'Ciudad',data:'ciudad'},
    {title:'Direccion',data:'direccion'},
    {title:'Celular',data:'celular'},
    {title:'Correo',data:'correo'},
  ];

  constructor(private thirdService: ThirdService) {}

  ngOnInit() {
    this.thirdService.getThirdParties().subscribe((thirdParties) => {
      this.data = thirdParties;
    });
  }
}
