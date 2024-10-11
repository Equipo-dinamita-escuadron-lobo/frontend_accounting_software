import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ProductType } from '../../models/ProductType';
import { ProductTypeService } from '../../services/product-type-service.service';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';

@Component({
  selector: 'app-product-type-list',
  templateUrl: './product-type-list.component.html',
  styleUrls: ['./product-type-list.component.css']
})
export class ProductTypeListComponent implements OnInit {
  productTypes: ProductType[] = [];
  loading: boolean = false;
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;

  constructor(
    private productTypeService: ProductTypeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProductTypes();
    
  }

  loadProductTypes(): void {
    this.loading = true;
    this.entData = this.localStorageMethods.loadEnterpriseData();
    this.productTypeService.getAllProductTypesEnterprise(this.entData).subscribe(
      (data: ProductType[]) => {
        this.productTypes = data;
        this.loading = false;
      },
      error => {
        console.error('Error al cargar los tipos de producto:', error);
        Swal.fire({
          title: 'Error!',
          text: 'No se pudieron cargar los tipos de producto.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        this.loading = false;
      }
    );
  }

  editProductType(id: string): void {
    this.router.navigate([`/general/operations/product-types/edit/${id}`]);
  }

  deleteProductType(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productTypeService.deleteProductType(id).subscribe(
          () => {
            Swal.fire('Eliminado!', 'El tipo de producto ha sido eliminado.', 'success');
            this.loadProductTypes(); // Recargar la lista después de la eliminación
          },
          error => {
            console.error('Error al eliminar el tipo de producto:', error);
            Swal.fire('Error!', 'No se pudo eliminar el tipo de producto.', 'error');
          }
        );
      }
    });
  }
}
