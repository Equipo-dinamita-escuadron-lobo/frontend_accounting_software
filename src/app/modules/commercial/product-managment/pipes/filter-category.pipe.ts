import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCategory'
})
export class FilterCategoryPipe implements PipeTransform {

  transform(items: any[], filterCategory: string): any[] {
    if (!filterCategory || filterCategory.trim() === '') {
      return items;
    }

    return items.filter(item => 
      item.name.toLowerCase().includes(filterCategory.toLowerCase()) || 
      item.description.toLowerCase().includes(filterCategory.toLowerCase())
    );
  }

}
