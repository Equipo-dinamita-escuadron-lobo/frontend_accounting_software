
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUserList'
})
export class FilterUserList implements PipeTransform {
  transform(items: any[], filterName: string): any[] {
    if ((!filterName || filterName.trim() === '')) {
      return items;
    }

    return items.filter(item => item.firstName.toLowerCase().includes(filterName.toLowerCase()) || item.lastName.toLowerCase().includes(filterName) ||  item.username.toLowerCase().includes(filterName) ||  item.email.toLowerCase().includes(filterName));
  }
}
