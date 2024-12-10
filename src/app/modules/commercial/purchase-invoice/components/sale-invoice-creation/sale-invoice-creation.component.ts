import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { ProductCreationComponent } from '../../../product-managment/components/product-creation/product-creation.component';


import { CommonModule } from '@angular/common';
import { EnterpriseDetails } from '../../../enterprise-managment/models/Enterprise';
import { EnterpriseService } from '../../../enterprise-managment/services/enterprise.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InvoiceSelectSupplierComponent } from '../invoice-select-supplier/invoice-select-supplier.component';
import { ThirdServiceService } from '../../../third-parties-managment/services/third-service.service';
import { Third } from '../../../third-parties-managment/models/Third';
import { InvoiceSelectProductsComponent } from '../invoice-select-products/invoice-select-products.component';
import { ProductI } from '../../models/productInvoice';
import { Facture } from '../../models/facture';
import { ProductS } from '../../models/productSend';
import { InvoiceServiceService } from '../../services/invoice-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { buttonColors } from '../../../../../shared/buttonColors'
import { SaleInvoiceSelectedSupplierComponent } from '../sale-invoice-selected-supplier/sale-invoice-selected-supplier.component';
import { SaleInvoiceSelectedProductsComponent } from '../sale-invoice-selected-products/sale-invoice-selected-products.component';
import { FactureV } from '../../models/factureV';
import { ThirdCreationComponent } from '../../../third-parties-managment/components/third-creation/third-creation.component';
import { UnitOfMeasureService } from '../../../product-managment/services/unit-of-measure.service';
import { get } from 'jquery';
import { MatPaginatorModule } from '@angular/material/paginator';
@Component({

  selector: 'app-sale-invoice-creation',
  templateUrl: './sale-invoice-creation.component.html',
  styleUrls: ['./sale-invoice-creation.component.css'],

})



export class SaleInvoiceCreationComponent implements OnInit {
  /**
   * Detalles de la empresa seleccionada (opcional).
   * 
   * @type {EnterpriseDetails} - Objeto que contiene los detalles de la empresa seleccionada.
   */
  enterpriseSelected?: EnterpriseDetails;

  /**
   * Estado de carga para la vista previa del PDF.
   * 
   * @type {boolean} - Indica si se está cargando la vista previa del PDF.
   */
  isLoadingPdfPreview: boolean = false;

  /**
   * Estado de guardado para el PDF.
   * 
   * @type {boolean} - Indica si se está guardando el PDF.
   */
  isSavingPdf: boolean = false;

  /**
   * Variables relacionadas con terceros.
   * 
   * @type {boolean} showSectionThrid - Indica si se debe mostrar la sección de terceros.
   * @type {boolean} SectionNotas - Controla la visibilidad de la sección de notas.
   * @type {boolean} showInfoThird - Indica si se debe mostrar la información del tercero seleccionado.
   * @type {any} selectedSupplier - Almacena el proveedor seleccionado.
   * @type {number} selectedSupplierS - Almacena el ID del proveedor seleccionado (opcional).
   * @type {Third} supplierS - Objeto que representa el proveedor seleccionado (opcional).
   * @type {Third} supplierSCopy - Copia del objeto proveedor seleccionado (opcional).
   * @type {boolean} changeSupplierS - Indica si se ha realizado un cambio en el proveedor seleccionado.
   */
  showSectionThrid: boolean = true;
  SectionNotas: boolean = false;
  showInfoThird: boolean = false;
  selectedSupplier: any;
  selectedSupplierS?: number;
  supplierS?: Third;
  supplierSCopy?: Third;
  changeSupplierS: boolean = false;

  /**
   * Variables relacionadas con productos.
   * 
   * @type {boolean} showSectionProducts - Indica si se debe mostrar la sección de productos.
   * @type {boolean} showInfoProducts - Controla la visibilidad de la información de los productos.
   * @type {ProductI[]} lstProducts - Lista de productos disponibles.
   * @type {ProductI[]} lstProductsSecurity - Lista de productos relacionados con la seguridad.
   */
  showSectionProducts: boolean = true;
  showInfoProducts: boolean = false;
  lstProducts: ProductI[] = [];
  lstProductsSecurity: ProductI[] = [];

  /**
   * Variables relacionadas con la factura de compra.
   * 
   * @type {number} subTotal - El subtotal de la factura antes de impuestos y descuentos.
   * @type {number} taxTotal - El total de impuestos aplicados en la factura.
   * @type {number} uvt - El valor de la unidad de valor tributario (UVT).
   * @type {number} retention - El valor de la retención aplicada en la factura.
   * @type {number} descuentoPorc - El porcentaje de descuento aplicado en la factura.
   * @type {number} descuentoVal - El valor del descuento aplicado en la factura.
   * @type {number} descuentoTotal - El total de descuento aplicado, que puede ser un valor o un cálculo.
   * @type {number} total - El total de la factura después de aplicar impuestos y descuentos.
   * @type {boolean} impuestoCheck - Indica si se debe aplicar el impuesto en la factura.
   * @type {boolean} retencionCheck - Indica si se debe aplicar la retención en la factura.
   */
  subTotal: number = 0;
  taxTotal: number = 0;
  uvt: number = 47065;
  retention: number = 0;
  descuentoPorc: number = 0;
  descuentoVal: number = 0;
  descuentoTotal: number = 0;
  total: number = 0;
  impuestoCheck: boolean = true;
  retencionCheck: boolean = true;

  /**
   * Variables relacionadas con la factura de compra y el pago.
   * 
   * @type {Date} currentDate - La fecha actual al momento de la creación de la factura.
   * @type {string} dueDate - La fecha de vencimiento de la factura (opcional).
   * @type {string} paymentMethod - El método de pago seleccionado (por defecto 'debito').
   * @type {ProductS[]} lstProductsSend - Lista de productos a ser enviados en la factura.
   */
  currentDate: Date = new Date();
  dueDate?: string;
  paymentMethod: string = 'debito';
  lstProductsSend: ProductS[] = [];

  factureType: string = 'Venta';

  /**
   * Columnas de la tabla de productos.
   * 
   * @type {any[]} columnsProducts - Un array de objetos que define las columnas de la tabla de productos, incluyendo los títulos y los datos asociados.
   * Cada objeto puede tener un título para la columna y un campo de datos asociado.
   */
  columnsProducts: any[] = [
    { title: '#' },
    { title: 'Codigo', data: 'itemType' },
    { title: 'Descripción', data: 'description' },
    { title: 'Cantidad' },
    { title: 'U/M' },
    { title: 'Precio Unitario', data: 'price' },
    { title: 'Descuento' },
    { title: 'IVA' },
    { title: 'Subtotal' },
    { title: 'Eliminar' }
  ];

  //Campo para la nota
  nota: string = "";

  constructor(private enterpriseService: EnterpriseService,
    private location: Location,
    private UnitMeasureService: UnitOfMeasureService,
    private dialog: MatDialog,
    private thirdService: ThirdServiceService,
    private invoiceService: InvoiceServiceService,
    private router: Router) { }

  ngOnInit() {
    this.getEnterpriseSelectedInfo();
  }

  /**
   * Obtiene la información de la empresa seleccionada.
   * 
   * @returns {EnterpriseDetails | undefined} - Devuelve los detalles de la empresa seleccionada, o undefined si no se ha seleccionado ninguna empresa.
   * 
   * Si no hay una empresa seleccionada, se maneja el caso y no se realiza ninguna acción.
   * Si se ha seleccionado una empresa, se realiza una llamada a la API para obtener los detalles de la empresa por su ID.
   */
  getEnterpriseSelectedInfo() {
    const id = this.enterpriseService.getSelectedEnterprise();
    if (id === null) {
      // Manejar caso donde no hay empresa seleccionada
    } else {
      this.enterpriseService.getEnterpriseById(id).subscribe({
        next: (enterpriseData) => {
          this.enterpriseSelected = enterpriseData;
        },
      });
    }
    return this.enterpriseSelected;
  }

  /**
   * Cancela la creación de un producto y navega hacia la página anterior en el historial de navegación.
   */
  cancelCreateProduct() {
    this.location.back(); // Navega hacia atrás en el historial
  }

  /**
   * Obtiene la información de un proveedor a partir de su ID y la asigna a la propiedad local `supplierS`.
   * @param thirdId - Identificador del proveedor a consultar.
   */
  getSupplier(thirdId: any) {
    if (thirdId) {
      this.thirdService.getThirdPartie(thirdId).subscribe({
        next: (response: Third) => {
          this.supplierS = response;
        }
      });
    }
  }

  /**
 * Abre un cuadro de diálogo para seleccionar un proveedor utilizando un componente personalizado.
 */
  selectSupplier() {
    const dialogRef = this.OpenListThirds(
      'Selección de Cliente',
      this.enterpriseSelected?.id,
      SaleInvoiceSelectedSupplierComponent
    );

  }


  /**
   * Abre un cuadro de diálogo para crear un nuevo proveedor utilizando el componente de creación de terceros.
   * Configura las dimensiones, los datos iniciales y las clases personalizadas del cuadro de diálogo.
   */
  createSupplier() {
    const dialogRef = this.dialog.open(ThirdCreationComponent, {
      width: '900px',
      height: '80vh', // Establece una altura del 80% del viewport
      data: { destination: "destination" },
      panelClass: 'dialog-scrollable' // Agrega una clase personalizada al diálogo
    });
  }


  /**
   * Actualiza la lista de productos con la abreviatura de la unidad de medida correspondiente a cada producto.
   * Realiza una solicitud para obtener la unidad de medida por su ID y asigna la abreviatura al producto.
   * @param lstProducts - Lista de productos a actualizar.
   * @returns La lista de productos con las unidades de medida actualizadas.
   */
  getUnitOfMeasureForId(lstProducts: ProductI[]): ProductI[] {
    if (lstProducts != null || this.lstProducts.length > 0) {

      lstProducts.forEach((prod) => {
        //console.log(prod.unitOfMeasureId);
        this.UnitMeasureService.getUnitOfMeasuresId("" + prod.unitOfMeasureId).subscribe({
          next: (response) => {
            prod.unitOfMeasure = response.abbreviation;
          }
        });
      });
    }

    return lstProducts;

  }


  /**
   * Alterna la visibilidad de la sección relacionada con terceros.
   */
  showSectionThridM() {
    this.showSectionThrid = !this.showSectionThrid;
  }

  /**
   * Alterna la visibilidad de la sección de notas.
   */
  showSectionNotas() {
    this.SectionNotas = !this.SectionNotas;
  }

  /**
   * Abre un cuadro de diálogo para seleccionar productos utilizando un componente personalizado.
   * Configura el diálogo con el título, el ID de la empresa seleccionada y el ID del proveedor.
   */
  selectProducts() {

    const dialogRef = this.OpenListProducts(
      'Selección de Productos',
      this.enterpriseSelected?.id,
      this.supplierS?.thId,
      SaleInvoiceSelectedProductsComponent
    );
  }

  /**
   * Abre un cuadro de diálogo para crear un nuevo producto utilizando el componente de creación de productos.
   * Configura las dimensiones, los datos iniciales y las clases personalizadas del cuadro de diálogo.
   */
  createProduct() {
    const dialogRef = this.dialog.open(ProductCreationComponent, {
      width: '600px',
      height: '80vh',
      data: { destination: "destination" },
      panelClass: 'dialog-scrollable' // Agrega una clase personalizada al diálogo
    });
  }


  /**
 * Alterna la visibilidad de la sección de productos.
 */
  showSectionProductsM() {
    this.showSectionProducts = !this.showSectionProducts;
  }

  /**
   * Formatea un precio a dos decimales y lo convierte a una cadena de texto.
   * @param price - El precio a formatear.
   * @returns El precio formateado como una cadena.
   */
  formatPrice(price: number): string {
    price = parseFloat(price.toFixed(2))

    return price.toString();
  }

  /**
   * Maneja el evento de teclado, permitiendo solo números y teclas especiales como Backspace, ArrowLeft, y ArrowRight.
   * @param event - El evento de teclado.
   */
  onKeyDown(event: KeyboardEvent) {
    // Permitir solo números y teclas especiales como Backspace, Tab, etc.
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight'];
    if (!/\d/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  /**
 * Formatea un valor numérico, eliminando caracteres no numéricos y agregando separadores de miles para la visualización.
 * @param displayValue - El valor a mostrar (como cadena) que puede contener caracteres no numéricos.
 * @param value - El valor numérico a calcular.
 * @param formatValue - El valor formateado para mostrar.
 * @returns Un arreglo con el valor numérico y el valor formateado como cadena.
 */
  formatValue(displayValue: string, value: number, formatValue: string): [number, string] {

    if (displayValue === '') {
      value = 0;
      formatValue = '';
      return [0, ''];
    }
    // Elimina caracteres no numéricos
    const numericValue = String(displayValue).replace(/\D/g, '');

    // Almacena el valor sin formato en `value` para cálculos
    value = parseFloat(numericValue);

    // Agrega puntos de miles para el displayValue
    formatValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    //console.log(formatValue);

    return [value, formatValue];

  }

  /**
   * Calcula el total de un producto y actualiza los valores relacionados, como el IVA y el total de la factura.
   * Si se proporciona un índice y un producto, actualiza solo ese producto en la lista.
   * Si no se proporcionan parámetros, actualiza todos los productos.
   * @param index - El índice del producto en la lista (opcional).
   * @param prod - El producto a actualizar (opcional).
   */
  calculateTotal(index?: number, prod?: ProductI): void {
    if (index === undefined || prod === undefined) {
      if (prod != undefined) {
        prod.totalValue = this.calculateTotalValue(prod); //Llamado para cada producto
        prod.IvaValor = prod.totalValue * prod.IVA / 100;
        this.calculateInvoiceTotals(); //Llama para que se vaya actualizando los labels de abajo
      }

      return;
    } else {
      this.lstProducts[index].price = this.formatValue(prod.displayPrice, prod.price, prod.displayPrice)[0];
      this.lstProducts[index].displayPrice = this.formatValue(prod.displayPrice, prod.price, prod.displayPrice)[1];

      prod.totalValue = this.calculateTotalValue(prod); //Llamado para cada producto
      prod.IvaValor = prod.totalValue * prod.IVA / 100;
      this.calculateInvoiceTotals(); //Llama para que se vaya actualizando los labels de abajo
    }

  }

  /**
 * Cambia el tipo de descuento (porcentaje o valor) en un producto y actualiza los valores correspondientes.
 * Si el tipo es 'porc', se limpia el descuento en valor, y si es 'val', se limpia el descuento en porcentaje.
 * Luego, recalcula el total del producto y los totales de la factura.
 * @param type - El tipo de descuento: 'porc' para porcentaje o 'val' para valor.
 * @param prod - El producto al que se le aplicará el cambio de descuento.
 */
  switchDescuento(type: 'porc' | 'val', prod: ProductI): void {

    prod.descuentos[1] = this.formatValue(prod.displayDescuentos, prod.descuentos[1], prod.displayDescuentos)[0];
    prod.displayDescuentos = this.formatValue(prod.displayDescuentos, prod.descuentos[1], prod.displayDescuentos)[1];

    if (type === 'porc') {
      prod.descuentos[1] = 0; // Vacía el descuento en valor si se escribe en porcentaje
      prod.displayDescuentos = '0';
    } else if (type === 'val') {
      prod.descuentos[0] = 0; // Vacía el descuento en porcentaje si se escribe en valor


    }
    this.calculateTotal(undefined, prod);
    this.calculateInvoiceTotals();
  }


  /**
   * Calcula el valor total de un producto, considerando su precio, cantidad, descuentos en porcentaje y en valor.
   * @param prod - El producto para el cual se calculará el valor total.
   * @returns El valor total calculado del producto después de aplicar los descuentos, o 0 si la cantidad es 0.
   */
  calculateTotalValue(prod?: ProductI): any {
    if (prod) {
      if (prod.amount == 0) {
        return 0;
      }
      const totalValue = prod.price * prod.amount;

      return totalValue - (totalValue * prod.descuentos[0] / 100) - prod.descuentos[1];
    }

  }

  /**
 * Calcula la retención basada en un valor de UVT (Unidad de Valor Tributario) y el subtotal.
 * Si el subtotal es mayor que 27 veces el valor de la UVT, aplica una retención del 2.5%.
 * @param uvt - El valor de la UVT a utilizar para el cálculo.
 * @returns Un valor booleano que indica si se aplica o no la retención.
 */
  calculateRetention(uvt: number): boolean {
    this.uvt = uvt;
    if ((this.uvt * 27) < this.subTotal) {
      this.retention = this.subTotal * 0.025;
      return true
    } else {
      this.retention = 0;

      return false
    }

  }

  /**
   * Calcula los totales de la factura, incluyendo el subtotal, impuestos, retención y descuentos.
   * Recorre la lista de productos para calcular el subtotal y el descuento de cada uno, y luego calcula el total de impuestos y el total general de la factura.
   */
  calculateInvoiceTotals(): void {
    this.subTotal = 0;
    this.lstProducts.forEach(prod => {
      // Calcular subtotal para cada producto aplicando los descuentos
      let subtotalProducto = 0

      if (prod.amount != 0) {
        subtotalProducto = (prod.price * prod.amount)
          - ((prod.price * prod.amount) * prod.descuentos[0] / 100)
          - prod.descuentos[1];
      }

      // Agregar al subtotal total
      this.subTotal += subtotalProducto;

    });


    this.taxTotal = this.lstProducts.reduce((acc, prod) => acc + (this.calculateTotalValue(prod) * prod.IVA / 100), 0);


    if ((this.uvt * 27) < this.subTotal && this.retencionCheck) {
      this.retention = this.subTotal * 0.025;
    } else {
      this.retention = 0;
    }

    this.descuentoTotal = 0;
    this.lstProducts.forEach(prod => {
      // Calcular descuento para cada producto
      let descuentoCalculado = 0;
      if (prod.amount != 0) {
        descuentoCalculado = ((prod.price * prod.amount) * prod.descuentos[0] / 100) + prod.descuentos[1];
      }

      // Agregar el descuento al total
      this.descuentoTotal += descuentoCalculado;


    });


    this.total = this.subTotal + this.taxTotal - this.retention;
  }

  /**
 * Elimina un producto de la lista de productos y actualiza los totales de la factura.
 * @param index - El índice del producto a eliminar de la lista.
 */
  deleteProduct(index: number): void {
    this.lstProducts.splice(index, 1);
    this.calculateInvoiceTotals();
  }


  /**
 * Guarda la factura con la información de los productos, descuentos, impuestos y otros detalles relevantes.
 * Llama al método `loadFactureInfo` para cargar los datos necesarios y luego crea un objeto `FactureV` para enviarlo a la función `saveInvoice`.
 */
  saveFacture() {
    this.loadFactureInfo();
    //console.log("Productos a enviar" + this.lstProductsSend.forEach(prod => { console.log(prod) }));
    const factureS: FactureV = {
      entId: this.enterpriseSelected?.id,
      thId: this.supplierS?.thId,
      factCode: 0,
      factObservations: this.nota, //Modificar cuando se agregue campo en la vista
      descounts: this.descuentoTotal, //Modificar cuando se agregue campo en la vista
      factureType: this.factureType,
      factProducts: this.lstProductsSend,
      factSubtotals: this.subTotal,
      facSalesTax: this.taxTotal,
      facWithholdingSource: this.retention
    };

    this.saveInvoice(factureS);
  }

  /**
   * Guarda la factura, generando un archivo PDF y descargándolo en el navegador. 
   * Luego de guardar, limpia los datos de la factura y muestra un mensaje de éxito o error.
   * @param facture - Los datos de la factura a guardar, incluidos los productos, descuentos, impuestos, etc.
   */
  async saveInvoice(facture: any) {
    this.isSavingPdf = true;
    this.invoiceService.saveInvoice(facture).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Extraer el nombre del archivo del encabezado 'Content-Disposition'
        const contentDisposition = blob.type;
        const fileName = this.extractFileName(contentDisposition);

        //Para borrar datos de factura
        this.supplierS = undefined;
        this.supplierSCopy = undefined;
        this.lstProducts = [];
        this.lstProductsSend = [];
        this.showInfoThird = false;
        this.showInfoProducts = false;
        this.changeSupplierS = false;
        this.subTotal = 0;
        this.taxTotal = 0;
        this.retention = 0;
        this.total = 0;
        this.nota = "";
        this.descuentoVal = 0;
        this.descuentoPorc = 0;
        this.descuentoTotal = 0;

        link.setAttribute('download', fileName || 'facture.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        this.isSavingPdf = false;
        Swal.fire({
          title: 'Creación exitosa',
          text: 'Se ha creado la factura con éxito!',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'success',
        });
      },
      (error) => {
        this.isSavingPdf = false;
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error al crear la factura.',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
      }
    );
  }

  changeSupplier() {

  }

  /**
 * Extrae el nombre del archivo desde el encabezado 'Content-Disposition' de la respuesta HTTP.
 * @param contentDisposition - El valor del encabezado 'Content-Disposition' que contiene el nombre del archivo.
 * @returns El nombre del archivo extraído o null si no se encuentra.
 */
  private extractFileName(contentDisposition: string): string | null {
    const matches = /filename="(.+)"/.exec(contentDisposition);
    return matches && matches[1] ? matches[1] : null;
  }

  /**
   * Abre un cuadro de diálogo para seleccionar un tercero (por ejemplo, un proveedor) y maneja el comportamiento posterior a su cierre.
   * Si se selecciona un proveedor, se actualizan las secciones correspondientes y se muestra una advertencia si se cambia de proveedor.
   * @param title - El título del cuadro de diálogo.
   * @param entId - El ID de la empresa asociada al tercero.
   * @param component - El componente que se utilizará en el cuadro de diálogo.
   * @returns El `MatDialogRef` del cuadro de diálogo abierto.
   */
  OpenListThirds(title: any, entId: any, component: any): MatDialogRef<any> {
    const _popUp = this.dialog.open(component, {
      width: '50%',
      height: 'auto',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '100ms',
      data: {
        title: title,
        entId: entId
      }
    });

    _popUp.afterClosed().subscribe(result => {
      if (result) {
        //console.log('Información recibida del modal:', result);
        this.selectedSupplier = result;
        this.showInfoThird = true;
        this.showSectionProducts = true;
        this.getSupplier(result);

        if (this.supplierS?.thId !== this.supplierSCopy?.thId && this.lstProducts.length !== 0) {
          Swal.fire({
            title: "Cambio de proveedor",
            text: "Si cambia de proveedor se perderán los datos que hayan registrado en productos!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: buttonColors.confirmationColor,
            cancelButtonColor: buttonColors.cancelButtonColor,
            confirmButtonText: "Confirmar!"
          }).then((swalResult) => {
            if (swalResult.isConfirmed) {
              this.supplierSCopy = this.supplierS;
              this.lstProducts = [];
              this.showInfoProducts = false;
            }
          });
        }
      } else {
        this.supplierS = undefined;
        this.showInfoThird = false;
        this.showInfoProducts = false;
        this.showSectionProducts = false;
      }
    });

    return _popUp;
  }

  /**
   * Abre un cuadro de diálogo para seleccionar productos y maneja el comportamiento posterior a su cierre.
   * Si se seleccionan productos, actualiza la lista de productos, calcula el IVA, la cantidad y el valor total de cada uno, y actualiza los totales de la factura.
   * @param title - El título del cuadro de diálogo.
   * @param entId - El ID de la empresa asociada a los productos.
   * @param thId - El ID del proveedor asociado a los productos.
   * @param component - El componente que se utilizará en el cuadro de diálogo.
   * @returns El `MatDialogRef` del cuadro de diálogo abierto.
   */
  OpenListProducts(title: any, entId: any, thId: any, component: any): MatDialogRef<any> {
    const _popUp = this.dialog.open(component, {
      width: '50%', // Cambia a un valor mayor para que sea visible
      height: 'auto',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '100ms',
      data: {
        title: title,
        entId: entId,
        thId: thId,
        products: this.lstProducts
      }
    });

    _popUp.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        //console.log('Información recibida del modal:', result);
        let products = result.map((prod: any) => {
          return {
            id: prod.id,
            itemType: prod.itemType,
            description: prod.description,
            price: prod.cost,
            displayPrice: String(prod.cost),
            taxPercentage: prod.taxPercentage,
            unitOfMeasureId: prod.unitOfMeasureId,
            IVA: 0,
            IvaValor: 0,
            amount: 0,
            totalValue: 0,
            descuentos: [0, 0],
            displayDescuentos: '0'
          };
        });
        this.lstProducts = products;


        this.lstProducts.forEach(prod => {
          prod.IVA = prod.taxPercentage;
          prod.IvaValor = prod.price * prod.IVA / 100;
          prod.amount = 1;
          prod.totalValue = 0;
        });
        this.lstProducts = this.getUnitOfMeasureForId(this.lstProducts);
        //console.log(this.lstProducts);
        this.showInfoProducts = true;
        this.calculateInvoiceTotals();
      } else {
        //console.log('No seleccionó ningún producto');
        this.showInfoProducts = false;
      }
    });

    return _popUp;
  }

  /**
   * Genera una vista previa de la factura en formato PDF y la abre en una nueva ventana.
   * Si no se encuentra una factura, muestra un mensaje de error. Si la vista previa se genera con éxito, se muestra una notificación.
   */
  async generatePdfPreview() {

    this.loadFactureInfo();

    const previewFacture: FactureV = {
      entId: this.enterpriseSelected?.id,
      thId: this.supplierS?.thId,
      factCode: 0,
      factureType: this.factureType,
      descounts: this.descuentoTotal,
      factObservations: this.nota,
      factProducts: this.lstProductsSend,
      factSubtotals: this.subTotal,
      facSalesTax: this.taxTotal,
      facWithholdingSource: this.retention
    };


    if (!previewFacture) {
      Swal.fire({
        title: 'Error',
        text: 'No hay factura disponible para mostrar.',
        icon: 'error',
        confirmButtonColor: buttonColors.confirmationColor,
      });
      return;
    }
    this.isLoadingPdfPreview = true;
    this.invoiceService.generateInvoicePreview(previewFacture).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url);
        this.isLoadingPdfPreview = false;
        Swal.fire({
          title: 'Visualización exitosa',
          text: 'Se ha generado la vista previa de la factura.',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'success',
        });
      },
      (error) => {
        this.isLoadingPdfPreview = false;
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error al generar la vista previa de la factura.',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
      }
    );
  }

  /**
   * Calcula el descuento total de un producto, ya sea en porcentaje o en valor fijo.
   * Si el descuento es en valor fijo, calcula el porcentaje correspondiente sobre el precio total del producto.
   * @param product - El producto cuyo descuento total se va a calcular.
   * @returns El descuento total calculado, truncado a dos decimales.
   */
  calculateDescountTotal(product: ProductI): Number {
    if (product.descuentos[1] != 0) {
      const priceTotal = product.price * product.amount;
      const discount = 100 * product.descuentos[1] / priceTotal;
      return Math.floor(discount * 100) / 100; // Trunca a dos decimales
    }
    return Math.floor(product.descuentos[0] * 100) / 100; // Trunca a dos decimales
  }

/**
 * Carga la información de la factura, transformando los productos en un formato adecuado para el envío.
 * Calcula el descuento total de cada producto y su subtotal, teniendo en cuenta el IVA.
 */
  loadFactureInfo() {
    const descuento = 0;
    this.lstProductsSend = this.lstProducts.map(prod => ({

      productId: parseInt(prod.id),
      amount: prod.amount,
      description: prod.description,
      vat: prod.IVA / 100,
      descount: this.calculateDescountTotal(prod),
      code: prod.itemType,
      unitPrice: prod.price,
      subtotal: (prod.price * prod.amount * (1 + prod.IVA / 100))
    }));
  }


}
