import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Tax } from '../../models/Tax';
import { TaxService } from '../../services/tax.service';


@Component({
  selector: 'app-edit-tax',
  templateUrl: './edit-tax.component.html',
  styleUrl: './edit-tax.component.css'
})
export class EditTaxComponent {

  taxId: number = 0; 
  tax: Tax = {} as Tax
  editForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private taxService: TaxService
  ) {
    this.editForm = this.formBuilder.group({
      code: ['', Validators.required],
      description: ['', Validators.required],
      interest: [null, [Validators.required, Validators.min(0)]],
      depositAccountId: [null, Validators.required],
      refundAccountId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taxId = +params['id']; // Obtener el ID del impuesto de los parámetros de la ruta
      this.getTaxDetails();
    });
  }

  getTaxDetails(): void {
    this.taxService.getTaxById(this.taxId).subscribe(
      (tax: Tax) => {
        this.tax = tax;
        this.editForm.patchValue({
          code: tax.code,
          description: tax.description,
          interest: tax.interest,
          depositAccountId: tax.depositAccountId,
          refundAccountId: tax.refundAccountId
        });
      },
      error => {
        console.error('Error obteniendo detalles del impuesto:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedTax: Tax = this.editForm.value;
      updatedTax.id = this.taxId; // Asignar el ID del impuesto

      this.taxService.updateTax(updatedTax).subscribe(
        (response: Tax) => {
          Swal.fire({
            title: 'Edición exitosa!',
            text: 'Se ha editado el impuesto exitosamente!',
            icon: 'success',
          });
          this.router.navigate(['/ruta-a-tus-impuestos']); // Redirigir al listado de impuestos después de la edición
        },
        error => {
          console.error('Error al editar el impuesto:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Ha ocurrido un error al editar el impuesto.',
            icon: 'error',
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa correctamente el formulario antes de enviarlo.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/general/operation/taxes']); // Ajusta la ruta según corresponda
  }
}
