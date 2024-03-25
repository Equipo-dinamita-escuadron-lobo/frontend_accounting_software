
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEnterpriseList'
})
export class FilterEnterpriseList implements PipeTransform {
  transform(items: any[], filterName: string): any[] {
    if ((!filterName || filterName.trim() === '')) {
      return items;
    }

    return items.filter(item => item.name.toLowerCase().includes(filterName.toLowerCase()) || item.nit.toLowerCase().includes(filterName));
  }
}
