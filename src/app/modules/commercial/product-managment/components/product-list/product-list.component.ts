import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router'; // Importa Router desde '@angular/router'
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { Category } from '../../models/Category';
import { Product } from '../../models/Product'; // Importa el modelo Product
import { ProductType } from '../../models/ProductType';
import { UnitOfMeasure } from '../../models/UnitOfMeasure';
import { CategoryService } from '../../services/category.service';
import { ProductTypeService } from '../../services/product-type-service.service';
import { ProductService } from '../../services/product.service'; // Importa el servicio ProductService
import { UnitOfMeasureService } from '../../services/unit-of-measure.service';
import { ProductDetailsModalComponent } from '../product-details/product-details.component';
import { buttonColors } from '../../../../../shared/buttonColors';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, AfterViewInit {
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;
  products: Product[] = []; // Inicializa la lista de productos
  unitOfMeasures: UnitOfMeasure[]= [];
  categories: Category[] = [];
  types: ProductType[] = [];

  displayedColumns: string[] = ['id', 'code', 'itemType', 'unitOfMeasure', 'category', 'reference', 'productType', 'actions'];
  dataSource = new MatTableDataSource<Product>(this.products);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  // Método para filtrar los productos
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
  }

  
  form: FormGroup;

  //variables para el doble clic
  selectedProductId: string | null = null;
  timer: any;

  constructor(
    private productService: ProductService,
    private unitOfMeasureService: UnitOfMeasureService,
    private categoryService: CategoryService,
    private typeProductService: ProductTypeService,   
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
        
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
      this.getUnitOfMeasures();
      this.getCategories();
      this.getTypeProduct();
      //this.getProviders();
    }
  }
  getProducts(): void {
    this.productService.getProducts(this.entData).subscribe(
      (data: Product[]) => {
        this.products = data; // Asigna los productos obtenidos del servicio a la propiedad products
        this.dataSource = new MatTableDataSource<Product>(this.products);
        this.dataSource.paginator = this.paginator;
        console.log(this.dataSource);
        
      },
      (error) => {
        console.log('Error al obtener los productos:', error);
      }
    );
  }

  getUnitOfMeasures(): void{
    this.unitOfMeasureService.getUnitOfMeasures(this.entData).subscribe(
      (data: UnitOfMeasure[]) => {
        this.unitOfMeasures = data; // Asigna los productos obtenidos del servicio a la propiedad products
      },
      (error) => {
        console.log('Error al obtener las unidades de medida:', error);
      }
    );
  }

  getCategories(): void{
    this.categoryService.getCategories(this.entData).subscribe(
      (data: Category[]) => {
        this.categories = data; // Asigna los productos obtenidos del servicio a la propiedad products
      },
      (error) => {
        console.log('Error al obtener las categorías:', error);
      }
    );
  }

  getTypeProduct(): void {
    this.typeProductService.getAllProductTypes().subscribe(
      (data: ProductType[]) => {
        console.log('Tipos de producto:', data);
        this.types = data;
      },
      (error) => {
        console.error('Error al obtener los tipos de producto:', error);
      }
    );
  }

  getCategoryName(id: number): string {
    const cat = this.categories.find(category => category.id === id);
    return cat ? cat.name : 'No encontrado';
  }
  getUnitOfMeasureName(id: number): string {
    const uom = this.unitOfMeasures.find(unitOfMeasure => unitOfMeasure.id === id);
    return uom ? uom.name : 'No encontrado';
  }

  getProductTypeName(id: number): string{
    const ptn =  this.types.find(type => type.id === id);
    return ptn ? ptn.name : 'No encontrado';
  }

  /*getProviderName(id: number): string {
    const provider = this.providers.find(provider => provider.idNumber === id);
    return provider ? provider.socialReason : 'No encontrado';
  }*/

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
    // Utilizando SweetAlert para mostrar un cuadro de diálogo de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de que deseas eliminar este producto?',
      icon: 'warning',
      confirmButtonColor: buttonColors.confirmationColor,
      cancelButtonColor: buttonColors.cancelButtonColor,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      // Si el usuario confirma la eliminación
      if (result.isConfirmed) {
        this.productService.deleteProduct(productId).subscribe(
          (data: Product) => {
            console.log('Producto eliminado con éxito: ', data);
            this.getProducts();
            // Mostrar cuadro de diálogo de éxito
            Swal.fire({
              title: 'Eliminado con éxito',
              text: 'El producto se ha eliminado correctamente.',
              icon: 'success',
              confirmButtonColor: buttonColors.confirmationColor,
              confirmButtonText: 'Aceptar'
            });
            //this.router.navigate(['/general/operations/products']);
          },
          (error) => {
            console.error('Error al eliminar el producto: ', error);
            // Mostrar cuadro de diálogo de error
            Swal.fire({
              title: 'Error al eliminar',
              text: 'Ha ocurrido un error al intentar eliminar el producto.',
              icon: 'error',
              confirmButtonColor: buttonColors.confirmationColor,
              confirmButtonText: 'Aceptar'
            });
          }
        );
      }
    });
  }

  openDetailsModal(id: any) {
    let product = this.products.find(prod => prod.id === id) || null;
    const productList = {
      id: product?.id ?? '',

      itemType: product?.itemType,
      description: product?.description,
      quantity: product?.quantity,
      taxPercentage: product?.taxPercentage,
      creationDate: product?.creationDate,
      unitOfMeasureName: this.getUnitOfMeasureName(product?.unitOfMeasureId ?? 0),
     // supplierName: this.getProviderName(product?.supplierId??0),
      categoryName: this.getCategoryName(product?.categoryId??0),
      enterpriseId: product?.enterpriseId,
      cost: product?.cost,
      state: product?.state,
      reference: product?.reference, 
      productTypeName: this.getProductTypeName(product?.productTypeId??0),
    };

    this.OpenPopUp(productList, 'Detalles del producto', ProductDetailsModalComponent);
  }

  OpenPopUp(productList: any, title: any, component: any) {
    var _popUp = this.dialog.open(component, {
      width: '40%',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '600ms',
      data: {
        title: title,
        product: productList,
      },
    });
    _popUp.afterClosed().subscribe();
  }

  //Método para formatear el precio
 /* formatCost(cost: number): string {
    // Formatear el precio con separador de miles
    return cost.toLocaleString('es-ES');
  }*/
}
