import { Pipe, PipeTransform } from '@angular/core';

/**
 * Filtro de terceros por nombres, razón social, número de identificación, tipo de identificación o correo electrónico
 */
@Pipe({
  name: 'filterThird'
})
export class FilterPipe implements PipeTransform {
  /**
   * Filtra los terceros por nombres, razón social, número de identificación, tipo de identificación o correo electrónico
   * @param items 
   * @param filterList 
   * @retuins any[]
   */
  transform(items: any[], filterList: string): any[] {
    if ((!filterList || filterList.trim() === '')) {
      return items;
    }

    return items.filter(item => item.names.toLowerCase().includes(filterList.toLowerCase())
      || item.socialReason.toLowerCase().includes(filterList.toLowerCase())
      || item.idNumber.toString().includes(filterList)
      || item.typeId.toString().toLowerCase().includes(filterList.toLowerCase())
      || item.email.toLowerCase().includes(filterList.toLowerCase()));
  }

}
