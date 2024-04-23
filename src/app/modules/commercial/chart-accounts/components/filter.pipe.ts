import { Pipe, PipeTransform } from '@angular/core';
import { Account } from '../models/ChartAccount';

@Pipe({
  name: 'filterAccounts'
})
export class FilterPipe implements PipeTransform {

  transform(accounts: Account[], filterValue: string): Account[] {
    if (!accounts || !filterValue) {
      return accounts;
    }

    const lowercaseFilter = filterValue.toLowerCase();
    return this.filterAccountsRecursive(accounts, lowercaseFilter);
  }

  filterAccountsRecursive(accounts: Account[], filterValue: string): Account[] {
    let filteredAccounts: Account[] = [];

    accounts.forEach(account => {
      const filteredSubAccounts = account.subAccounts ?
        this.filterAccountsRecursive(account.subAccounts, filterValue) :
        [];

      const accountMatchesFilter = account.code.toLowerCase().includes(filterValue) || account.name.toLowerCase().includes(filterValue);

      if (accountMatchesFilter || filteredSubAccounts.length > 0) {
        const accountCopy: Account = { ...account, subAccounts: filteredSubAccounts };

        if (filteredSubAccounts.length > 0) {
          accountCopy.showSubAccounts = true;
          this.expandParentAccounts(account);
        } else if (accountMatchesFilter && account.parent) {
          this.expandParentAccounts(account.parent);
        }

        filteredAccounts.push(accountCopy);
      }
    });

    return filteredAccounts;
  }

  expandParentAccounts(account: Account): void {
    if (account.parent) {
      account.parent.showSubAccounts = true;
      this.expandParentAccounts(account.parent);
    }
  }
}
