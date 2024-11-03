import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Tax } from '../../models/Tax';
import { TaxService } from '../../services/tax.service';
import { ChartAccountService } from '../../../chart-accounts/services/chart-account.service';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { Account } from '../../../chart-accounts/models/ChartAccount';
import { buttonColors } from '../../../../../shared/buttonColors';



@Component({
  selector: 'app-edit-tax',
  templateUrl: './edit-tax.component.html',
  styleUrl: './edit-tax.component.css'
})
export class EditTaxComponent {

  taxId: number = 0;
  taxCode: string = "";
  tax: Tax = {} as Tax
  editForm: FormGroup;
  depositAccounts: any[] | undefined;
  refundAccounts: any[] | undefined;
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
    this.editForm = this.formBuilder.group({
      code: ['', Validators.required],
      description: ['', Validators.required],
      interest: [null, [Validators.required, Validators.min(0)]],
      depositAccount: [null, Validators.required],
      refundAccount: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.entData = this.localStorageMethods.loadEnterpriseData();
    this.getCuentas();
    this.route.params.subscribe(params => {
      this.taxCode = params['id'];
      this.getTaxDetails();
    });
    this.initializePercentage();
  }
  

  getTaxDetails(): void {
    this.taxService.getTaxById(this.taxCode, this.entData).subscribe(
      (tax: any) => {
        this.tax = tax;
        this.taxId = tax.id;
        this.editForm.patchValue({
          code: tax.code,
          description: tax.description,
          interest: tax.interest,
        });
        if (tax.depositAccount) {
          this.getCuentabycode(tax.depositAccount);
        }
        if (tax.refundAccount) {
          this.getCuentabycode(tax.refundAccount);
        }
      },
      error => {
        Swal.fire({
          title: 'Error',
          text: 'Error obteniendo detalles del impuesto.',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
      }
    );
  }
  

  getCuentabycode(code: string): void {
    this.chartAccountService.getAccountByCode(code, this.entData).subscribe(
      account => {
        if (account) {
          this.updateAccountInForm(account);  
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Cuenta no encontrada.',
            confirmButtonColor: buttonColors.confirmationColor,
            icon: 'error',
          });
        }
      },
      error => {
        Swal.fire({
          title: 'Error',
          text: 'Error al buscar la cuenta por código.',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
      }
    );
  }
  

  updateAccountInForm(account: Account): void {
    if (account) {
      if (this.tax.depositAccount === account.code) {
        this.editForm.patchValue({
          depositAccount: account.id
        });
      }
      if (this.tax.refundAccount === account.code) {
        this.editForm.patchValue({
          refundAccount: account.id
        });
      }
    }
  }
  
  
  getCuentas(): void {
    this.chartAccountService.getListAccounts(this.entData).subscribe(
      (data: any[]) => {
        this.accounts =  this.mapAccountToList(data);
        this.depositAccounts =  this.accounts;
        this.refundAccounts =  this.accounts;
      },
      error => {
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error obteniendo cuentas de depósito.',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
      }
    );
  }

  mapAccountToList(data: Account[]): Account[] {
    let result: Account[] = [];

    function traverse(account: Account) {
        let { children, ...accountWithoutChildren } = account;
        result.push(accountWithoutChildren as Account);

        if (children && children.length > 0) {
            children.forEach(child => traverse(child));
        }
    }

    data.forEach(account => traverse(account));
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
      getAccountCode(id: number): string {
        const account = this.accounts.find(cuenta => cuenta.id === id);
        return account ? account.code : 'No encontrado';
      }
      onSubmit(): void {
        if (this.editForm.valid) {
          const updatedTax: Tax = {
            ...this.editForm.value,
            id: this.taxId,
            idEnterprise: this.entData,
            code: this.editForm.value.code,
            description: this.editForm.value.description,
            interest: this.editForm.value.interest,
            depositAccount: this.getAccountCode(this.editForm.value.depositAccount),
            refundAccount: this.getAccountCode(this.editForm.value.refundAccount)
          }
          this.taxService.getTaxById(updatedTax.code, updatedTax.idEnterprise).subscribe(
            (response: Tax) => {
              if (response && response.id !== updatedTax.id) {
                Swal.fire({
                  title: 'Error',
                  text: 'Ya existe un impuesto con ese código.',
                  confirmButtonColor: buttonColors.confirmationColor,
                  icon: 'error',
                });
              } else {
                this.taxService.updateTax(updatedTax).subscribe(
                  () => {
                    Swal.fire({
                      title: 'Edición exitosa',
                      text: 'Se ha editado el impuesto exitosamente.',
                      confirmButtonColor: buttonColors.confirmationColor,
                      icon: 'success',
                    });
                    this.router.navigate(['/general/operations/taxes']); 
                  },
                  error => {
                    Swal.fire({
                      title: 'Error',
                      text: 'Ha ocurrido un error al editar el impuesto.',
                      confirmButtonColor: buttonColors.confirmationColor,
                      icon: 'error',
                    });
                  }
                );
              }
            },
            error => {
              this.taxService.updateTax(updatedTax).subscribe(
                () => {
                  Swal.fire({
                    title: 'Edición exitosa',
                    text: 'Se ha editado el impuesto exitosamente.',
                    confirmButtonColor: buttonColors.confirmationColor,
                    icon: 'success',
                  });
                  this.router.navigate(['/general/operations/taxes']); 
                },
                updateError => {
                  Swal.fire({
                    title: 'Error',
                    text: 'Ha ocurrido un error al editar el impuesto.',
                    confirmButtonColor: buttonColors.confirmationColor,
                    icon: 'error',
                  });
                }
              );
            }
          );
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, completa correctamente el formulario antes de enviarlo.',
            icon: 'error',
            confirmButtonColor: buttonColors.confirmationColor,
          });
        }
      }
      

  redirectToDetails(): void {
    this.router.navigate(['/tax/details', this.taxId]);
  }
  goBack(): void {
    this.router.navigate(['/general/operations/taxes']);
  }

  formatPercentage(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9.]/g, '');
  
    if (value) {
      this.editForm.get('interest')?.setValue(parseFloat(value), { emitEvent: false });
      
      input.value = value + '%';
  
      input.setSelectionRange(value.length, value.length);
    } else {
      this.editForm.get('interest')?.setValue(null, { emitEvent: false });
    }
  }

  initializePercentage(): void {
    const interestControl = this.editForm.get('interest');
    if (interestControl?.value) {
      interestControl.setValue(`${interestControl.value}%`, { emitEvent: false });
    }
  }
}