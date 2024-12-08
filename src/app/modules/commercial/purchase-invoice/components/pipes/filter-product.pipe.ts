import { Pipe, PipeTransform } from '@angular/core';

/**
 * Filtro de productos por tipo, código o descripción
 */
@Pipe({
  name: 'filterProduct'
})
export class FilterProductPipe implements PipeTransform {
  /**
   * Filtra los productos por tipo, código o descripción
   * @param items 
   * @param filterList 
   * @retuins any[]
   */
  transform(items: any[], filterList: string): any[] {
    if ((!filterList || filterList.trim() === '')) {
      return items;
    }

    return items.filter(item => item.itemType.toLowerCase().includes(filterList.toLowerCase()) 
    || item.code.toLowerCase().includes(filterList.toLowerCase())
    //|| item.supplier.toLowerCase().includes(filterList.toLowerCase())
    || item.description.toLowerCase().includes(filterList.toLowerCase())
   
  );
  }

}
