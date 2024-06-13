import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Tax } from '../../models/tax';
import { TaxService } from '../../services/tax.service';

@Component({
  selector: 'app-list-tax',
  templateUrl: './list-tax.component.html',
  styleUrl: './list-tax.component.css'
})
export class ListTaxComponent {

  taxes: Tax[] = [];
  columns: any[] = [
    { title: 'Código', data: 'code' },
    { title: 'Descripción', data: 'description' },
    { title: 'Interés', data: 'interest' },
    { title: 'Cuenta de Depósito', data: 'depositAccountName' },
    { title: 'Cuenta de Reembolso', data: 'refundAccountName' },
    { title: 'Acciones', data: 'actions' }
  ];

  constructor(
    private taxService: TaxService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getTaxes();
  }

  getTaxes(): void {
    this.taxService.getTaxes('enterpriseId').subscribe(
      (data: Tax[]) => {
        this.taxes = data;
      },
      (error) => {
        console.error('Error al obtener los impuestos:', error);
      }
    );
  }

  deleteTax(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de que deseas eliminar este impuesto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.taxService.deleteTax(id).subscribe(
          (data: Tax) => {
            console.log('Impuesto eliminado con éxito: ', data);
            this.getTaxes();
            Swal.fire({
              title: 'Eliminado con éxito',
              text: 'El impuesto se ha eliminado correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          },
          (error) => {
            console.error('Error al eliminar el impuesto: ', error);
            Swal.fire({
              title: 'Error al eliminar',
              text: 'Ha ocurrido un error al intentar eliminar el impuesto.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        );
      }
    });
  }

}




