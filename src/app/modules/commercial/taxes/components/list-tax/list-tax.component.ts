import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { TaxService } from '../../services/tax.service';
import { Tax } from '../../models/Tax';

@Component({
  selector: 'app-list-tax',
  templateUrl: './list-tax.component.html',
  styleUrls: ['./list-tax.component.css']
})
export class ListTaxComponent implements OnInit {

  taxes: Tax[] = [];
  columns: any[] = [
    { title: 'Código', data: 'code' },
    { title: 'Descripción', data: 'description' },
    { title: 'Interés', data: 'interest' },
    { title: 'Cuenta de Depósito', data: 'depositAccountName' },
    { title: 'Cuenta de Reembolso', data: 'refundAccountName' },
    { title: 'Acciones', data: 'actions' }
  ];

  selectedTaxId: number | null = null;
  timer: any;

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

  redirectTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  redirectToEdit(taxId: number): void {
    if (this.selectedTaxId === taxId) {
      // Doble clic, navegar a la página de edición del impuesto
      this.router.navigate(['/general/operations/taxes/edit/', taxId]);
      // Reiniciar el temporizador y el ID del impuesto seleccionado
      clearTimeout(this.timer);
      this.selectedTaxId = null;
    } else {
      // Primer clic, iniciar el temporizador
      this.selectedTaxId = taxId;
      this.timer = setTimeout(() => {
        // Limpiar el temporizador si pasa un tiempo después del primer clic
        clearTimeout(this.timer);
        this.selectedTaxId = null;
      }, 300); // Tiempo en milisegundos para considerar un doble clic
    }
  }

  redirectToDelete(taxId: number): void {
    // Utilizando SweetAlert para mostrar un cuadro de diálogo de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de que deseas eliminar este impuesto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      // Si el usuario confirma la eliminación
      if (result.isConfirmed) {
        this.taxService.deleteTax(taxId).subscribe(
          () => {
            console.log('Impuesto eliminado con éxito');
            this.getTaxes(); // Actualizar la lista de impuestos
            Swal.fire({
              title: 'Eliminado con éxito',
              text: 'Se ha eliminado el impuesto con éxito.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          },
          (error) => {
            console.error('Error al eliminar el impuesto:', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el impuesto.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        );
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/general/operation/taxes']);
  }
}
