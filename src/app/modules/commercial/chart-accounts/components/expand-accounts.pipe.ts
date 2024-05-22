import { Pipe, PipeTransform } from '@angular/core';
import { Account } from '../models/ChartAccount';

@Pipe({
  name: 'expandAccounts'
})
export class ExpandAccountsPipe implements PipeTransform {

  transform(accounts: Account[], showSubAccounts: boolean): Account[] {
    if (showSubAccounts) {
      return accounts.filter(account => account.showSubAccounts || this.hasVisibleChildren(account));
    } else {
      return accounts.filter(account => !account.parentAccount);
    }
  }

  private hasVisibleChildren(account: Account): boolean {
    if (account.children && account.children.length > 0) {
      return account.children.some(child => child.showSubAccounts || this.hasVisibleChildren(child));
    }
    return false;
  }

}
