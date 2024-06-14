import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Tax } from '../../models/Tax';
import { TaxService } from '../../services/tax.service';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { ChartAccountService } from '../../../chart-accounts/services/chart-account.service';
import { Account } from '../../../chart-accounts/models/ChartAccount';
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
  refundAccounts: any[] = [];
  selectedAccount: any;
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;

  accounts: any[] = [];
  filterAccount: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private taxService: TaxService,
    private chartAccountService: ChartAccountService,
  ) {
    this.accounts = [];

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
    this.getCuentas();
  }
  getCuentas(): void {
    this.chartAccountService.getListAccounts(this.entData).subscribe(
      (data: any[]) => {
        this.accounts =  this.mapAccountToList(data);
        this.depositAccounts =  this.accounts;
        this.refundAccounts =  this.accounts;
      },
      error => {
        console.error('Error obteniendo cuentas de depósito:', error);
      }
    );
  }

  mapAccountToList(data: Account[]): Account[] {
    let result: Account[] = [];
    console.log('data:', data);
  
    function traverse(account: Account) {
        // Clonamos el objeto cuenta sin los hijos
        let { children, ...accountWithoutChildren } = account;
        result.push(accountWithoutChildren as Account);
  
        // Llamamos recursivamente para cada hijo
        if (children && children.length > 0) {
            children.forEach(child => traverse(child));
        }
    }
  
    data.forEach(account => traverse(account));
    console.log('result:', result);
    return result;
  }
  get filteredAccounts() {
  if (this.accounts) {
    return this.accounts.filter(account =>
      `${account.code} - ${account.description}`.toLowerCase().includes(this.filterAccount.toLowerCase())
    );
  }
  return [];
  }
  
  customSearchFn(term: string, item: any) {
  term = term.toLowerCase();
  return item.code.toLowerCase().includes(term) || item.description.toLowerCase().includes(term);
  }
  
  
      validationsAll() {
        return {
          stringSearchCategory: [''],
        };
      }

  onSubmit(): void {
    if (this.addForm.valid) {
      const createdTax: Tax = this.addForm.value;
      console.log(createdTax)
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
          console.error('Error al crear el impuesto:', error);
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

}
