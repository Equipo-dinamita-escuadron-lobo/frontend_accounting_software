import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Tax } from '../../models/Tax';
import { TaxService } from '../../services/tax.service';
import { ChartAccountService } from '../../../chart-accounts/services/chart-account.service';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
@Component({
  selector: 'app-create-tax',
  templateUrl: './create-tax.component.html',
  styleUrl: './create-tax.component.css'
})
export class CreateTaxComponent {
  taxId: number = 0;
  tax: Tax = {} as Tax
  addForm: FormGroup;
  depositAccounts: any[] = [];
  mappedAccounts: any[] = [];
  selectedAccount: any;
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private taxService: TaxService,
    private accountService: ChartAccountService //
  ) {
    this.addForm = this.formBuilder.group({
      code: ['', Validators.required],
      description: ['', Validators.required],
      interest: [null, [Validators.required, Validators.min(0)]],
      depositAccountId: [null, Validators.required],
      refundAccountId: [null, Validators.required]
    });
  }
  ngOnInit(): void {
    this.entData = this.localStorageMethods.loadEnterpriseData();
    this.loadDepositAccounts();
  }
  onSubmit(): void {
    if (this.addForm.valid) {
      const createdTax: Tax = this.addForm.value;
      createdTax.id = this.taxId;
      this.taxService.createTax(createdTax).subscribe(
        (response: Tax) => {
          Swal.fire({
            title: 'Impuesto agregado!',
            text: 'Se agregó el impuesto exitosamente!',
            icon: 'success',
          });
          this.router.navigate(['/general/operations/taxes']);
        },
        error => {
          console.error('Error al editar el impuesto:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Ha ocurrido un error al agregar el impuesto.',
            icon: 'error',
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa correctamente el formulario antes de enviarlo.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }
  goBack(): void {
    this.router.navigate(['/general/operations/taxes']);
  }
  loadDepositAccounts(): void {
    this.accountService.getListAccounts(this.entData).subscribe(
      (accounts: any[]) => {
        console.log(accounts)
        this.depositAccounts = accounts;
        this.mappedAccounts = this.flattenAccounts(accounts);
      },
      error => {
        console.error('Error obteniendo cuentas de depósito:', error);
      }
    );
  }
  flattenAccounts(accounts: any[]): any[] {
    let result: any[] = [];
    accounts.forEach(account => {
      result.push({ id: account.id, name: account.name });
      if (account.children && account.children.length > 0) {
        result = result.concat(this.flattenAccounts(account.children));
      }
    });
    return result;
  }

  customSearchFn(term: string, item: any): boolean {
    term = term.toLowerCase();
    return item.name.toLowerCase().indexOf(term) > -1;
  }
}
