import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Tax } from '../../models/Tax';
import { TaxService } from '../../services/tax.service';
import { ChartAccountService } from '../../../chart-accounts/services/chart-account.service';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { Account } from '../../../chart-accounts/models/ChartAccount';



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
      depositAccountId: [null, Validators.required],
      refundAccountId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.entData = this.localStorageMethods.loadEnterpriseData();
    this.getCuentas();
    this.route.params.subscribe(params => {
      this.taxCode = +params['id']+""; // Obtener el ID del impuesto de los parámetros de la ruta
      this.getTaxDetails();
    });
     this.getTaxDetails();
    //this.getCuentas();
  }

  getTaxDetails(): void {
    this.taxService.getTaxById(this.taxCode,this.entData).subscribe(
      (tax:any) => {
        this.tax = tax;
        this.taxId = tax.id;
        console.log('Detalles del impuesto:', tax);
        this.editForm.patchValue({
          code: tax.code,
          description: tax.description,
          interest: tax.interest,
          depositAccountId: this.getCuentabycode(tax.depositAccount),
          refundAccountId: this.getCuentabycode(tax.refundAccount )
        });
        console.log('Formulario con detalles del tax:', this.tax);
        console.log('Formulario con detalles del impuesto:', this.editForm.value);
      },
      error => {
        console.error('Error obteniendo detalles del impuesto:', error);
      }
    );
  }
  getCuentabycode(code: number): number {
    console.log('code:', code);
    console.log('accounts333333:', this.accounts);
    const account = this.accounts.find(account => account.code === code);
    return account ? account.id : 'No encontrado';
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
    if (this.editForm.valid) {
      const updatedTax: Tax = this.editForm.value;
      updatedTax.id = this.taxId; // Asignar el ID del impuesto
console.log('updatedTax:', updatedTax);
      this.taxService.updateTax(updatedTax).subscribe(
        (response: Tax) => {
          Swal.fire({
            title: 'Edición exitosa!',
            text: 'Se ha editado el impuesto exitosamente!',
            icon: 'success',
          });
          this.router.navigate(['/ruta-a-tus-impuestos']); // Redirigir al listado de impuestos después de la edición
        },
        error => {
          console.error('Error al editar el impuesto:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Ha ocurrido un error al editar el impuesto.',
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

  redirectToDetails(): void {
    // Implementar lógica para redirigir a la vista de detalles del impuesto
    this.router.navigate(['/tax/details', this.taxId]);
  }
  goBack(): void {
    this.router.navigate(['/general/operations/taxes']); // Ajusta la ruta según corresponda
  }
}
