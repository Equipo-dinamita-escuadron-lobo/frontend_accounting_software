import { Pipe, PipeTransform } from '@angular/core';
import { Account } from '../../chart-accounts/models/ChartAccount';

@Pipe({
  name: 'filterAccount'
})
export class FilterAccountPipe implements PipeTransform {

  /**
   * Filter accounts by code or description recursively
   * @param accounts 
   * @param filterValue 
   * @returns 
   */
  transform(accounts: Account[], filterValue: string): Account[] {
    if (!accounts || !filterValue) {
      return accounts;
    }

    const lowercaseFilter = filterValue.toLowerCase();
    return this.filterAccountsRecursive(accounts, lowercaseFilter);
  }

  /**
   * Filter accounts by code or description recursively
   * @param accounts 
   * @param filterValue 
   * @returns 
   */
  filterAccountsRecursive(accounts: Account[], filterValue: string): Account[] {
    let filteredAccounts: Account[] = [];

    accounts.forEach(account => {
      const filteredSubAccounts = account.children ?
        this.filterAccountsRecursive(account.children, filterValue) :
        [];

      const accountMatchesFilter = account.code.toLowerCase().includes(filterValue) || account.description.toLowerCase().includes(filterValue);

      if (accountMatchesFilter || filteredSubAccounts.length > 0) {
        const accountCopy: Account = { ...account, children: filteredSubAccounts };

        if (filteredSubAccounts.length > 0) {
          accountCopy.showSubAccounts = true;
          this.expandParentAccounts(account);
        } else if (accountMatchesFilter && account.parentAccount) {
          this.expandParentAccounts(account.parentAccount);
        }

        filteredAccounts.push(accountCopy);
      }
    });

    return filteredAccounts;
  }

  /**
   * Expand parent accounts recursively to show the filtered account
   * @param account 
   */
  expandParentAccounts(account: Account): void {
    if (account.parentAccount) {
      account.parentAccount.showSubAccounts = true;
      this.expandParentAccounts(account.parentAccount);
    }
  }
}
