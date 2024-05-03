import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service'; // Importa el servicio ProductService
import { Product } from '../../models/Product'; // Importa el modelo Product
import { Router } from '@angular/router'; // Importa Router desde '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsModalComponent } from '../product-details/product-details.component';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { UnitOfMeasure } from '../../models/UnitOfMeasure';
import { UnitOfMeasureService } from '../../services/unit-of-measure.service';
import { Category } from '../../models/Category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;
  products: Product[] = []; // Inicializa la lista de productos
  columns: any[] = [
    //{title: 'Id', data: 'id'},
    { title: 'Codigo', data: 'code' },
    { title: 'Nombres', data: 'itemType' },
    { title: 'Descripción', data: 'description' },
    { title: 'Precio', data: 'price' },
    { title: 'Min', data: 'minQuantity' },
    //{title:'max',data:'maxQuantity'},
    //{title:'tax',data:'taxPercentage'},
    //{title:'f creación',data:'creationDate'},
    { title: 'Unidad', data: 'unitOfMeasure' },
    { title: 'Prov', data: 'supplier' },
    { title: 'Cat', data: 'category' },
    { title: 'Acciones', data: 'actions' },
  ];

  form: FormGroup;

  //variables para el doble clic
  selectedProductId: string | null = null;
  timer: any;

  constructor(
    private productService: ProductService,
    private unitOfMeasureService: UnitOfMeasureService,
    private categoryService: CategoryService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group(this.validationsAll());
  } // Inyecta el servicio ProductService en el constructor

  validationsAll() {
    return {
      stringSearch: [''],
    };
  }

  ngOnInit(): void {
    this.entData = this.localStorageMethods.loadEnterpriseData();
    if (this.entData) {
      this.getProducts(); // Llama al método getProducts() al inicializar el componente
    }
  }

  getUnitOfMeasureName(id: number): string {
    this.unitOfMeasureService.getUnitOfMeasuresId(id.toString()).subscribe(
      (data: UnitOfMeasure) => {
        return data.name;
      },
      (error) => {
        console.log('Error al obtener la unidad de medida:', error);
      }
    );
    return '';
  }
getCategoryName(id: number): string {
    this.categoryService.getCategoryById(id.toString()).subscribe(
      (data: Category) => {
        return data.name;
      },
      (error) => {
        console.log('Error al obtener la categoria:', error);
      }
    );
    return '';
  }

  getProducts(): void {
    this.productService.getProducts(this.entData.entId).subscribe(
      (data: Product[]) => {
        this.products = data; // Asigna los productos obtenidos del servicio a la propiedad products
      },
      (error) => {
        console.log('Error al obtener los productos:', error);
      }
    );
  }
  // Método para redirigir a una ruta específica
  redirectTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  // Método para redirigir a la página de edición de un producto
  redirectToEdit(productId: string): void {
    if (this.selectedProductId === productId) {
      // Doble clic, navegar a la página de edición
      this.router.navigate(['/general/operations/products/edit/', productId]);
      // Reiniciar el temporizador y el ID del producto seleccionado
      clearTimeout(this.timer);
      this.selectedProductId = null;
    } else {
      // Primer clic, iniciar el temporizador
      this.selectedProductId = productId;
      this.timer = setTimeout(() => {
        // Limpiar el temporizador si pasa un tiempo después del primer clic
        clearTimeout(this.timer);
        this.selectedProductId = null;
      }, 300); // Tiempo en milisegundos para considerar un doble clic
    }
  }

  deleteProduct(productId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.deleteProduct(productId).subscribe(
        (data: Product) => {
          console.log('Producto eliminado con éxito: ', data);
          this.router.navigate(['/general/operations/products']);
        },
        (error) => {
          console.error('Error al eliminar el producto: ', error);
        }
      );
    }
  }

  openDetailsModal(id: any) {
    this.OpenPopUp(id, 'Detalles del producto', ProductDetailsModalComponent);
  }

  OpenPopUp(id: any, title: any, component: any) {
    var _popUp = this.dialog.open(component, {
      width: '40%',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '600ms',
      data: {
        title: title,
        productId: id,
      },
    });
    _popUp.afterClosed().subscribe();
  }
}
