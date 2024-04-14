import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUnitOfMeasure'
})
export class FilterUnitOfMeasurePipe implements PipeTransform {

  transform(items: any[], filterUnitOfMeasure: string): any[] {
    if (!filterUnitOfMeasure || filterUnitOfMeasure.trim() === '') {
      return items;
    }

    // Verificar si el filtro es un número
    const isNumberFilter = !isNaN(parseFloat(filterUnitOfMeasure)) && isFinite(+filterUnitOfMeasure);

    return items.filter(item => {
      const idMatch = isNumberFilter && item.id === parseInt(filterUnitOfMeasure); // Comparar como número
      const nameMatch = item.name.toLowerCase().includes(filterUnitOfMeasure.toLowerCase());
      const descriptionMatch = item.description.toLowerCase().includes(filterUnitOfMeasure.toLowerCase());

      return idMatch || nameMatch || descriptionMatch;
    });
  }

}
