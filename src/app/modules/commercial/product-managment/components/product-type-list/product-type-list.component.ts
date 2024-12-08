import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator'; // Importa MatPaginator
import { MatTableDataSource } from '@angular/material/table'; // Importa MatTableDataSource
import Swal from 'sweetalert2';
import { ProductType } from '../../models/ProductType';
import { ProductTypeService } from '../../services/product-type-service.service';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';

/**
 * Componente para listar los tipos de producto
 */
@Component({
  selector: 'app-product-type-list',
  templateUrl: './product-type-list.component.html',
  styleUrls: ['./product-type-list.component.css']
})
export class ProductTypeListComponent implements OnInit {
  /**
   * Variables del componente
   */
  displayedColumns: string[] = ['name', 'description']; // Define las columnas que se mostrarán
  dataSource = new MatTableDataSource<ProductType>(); // Cambia a MatTableDataSource
  loading: boolean = false; // Variable para saber si se está cargando
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods(); // Variable para almacenar los métodos de almacenamiento local
  entData: any | null = null; // Variable para almacenar los datos de la empresa

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Agrega la referencia al paginator

  /**
   * Constructor del componente
   * @param productTypeService 
   * @param router 
   */
  constructor(
    private productTypeService: ProductTypeService,
    private router: Router
  ) {}

  /**
   * Método para inicializar el componente
   */
  ngOnInit(): void {
    this.loadProductTypes();
  }

  /**
   * Método para cargar los tipos de producto
   */
  loadProductTypes(): void {
    this.loading = true;
    this.entData = this.localStorageMethods.loadEnterpriseData();
    this.productTypeService.getAllProductTypesEnterprise(this.entData).subscribe(
      (data: ProductType[]) => {
        this.dataSource.data = data; // Asigna los datos al dataSource
        this.dataSource.paginator = this.paginator; // Asigna el paginator al dataSource
        this.loading = false;
      },
      error => {
        console.error('Error al cargar los tipos de producto:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los tipos de producto.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        this.loading = false;
      }
    );
  }

  /**
   * Método para aplicar un filtro en la tabla
   * @param event
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Método para redirigir a la edición de un tipo de producto
   * @param id
   */
  editProductType(id: string): void {
    this.router.navigate([`/general/operations/product-types/edit/${id}`]);
  }

  /**
   * Método para redirigir a la creación de un tipo de producto
   */
  goBack(){
    this.router.navigate([`/general/operations/products`]);
  }

  /**
   * Método para eliminar un tipo de producto
   * @param id
   */
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
            Swal.fire('Error', 'No se pudo eliminar el tipo de producto.', 'error');
          }
        );
      }
    });
  }
}
