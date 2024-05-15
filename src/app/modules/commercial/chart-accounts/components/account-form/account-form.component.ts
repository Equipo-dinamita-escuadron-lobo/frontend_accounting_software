import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Account } from '../../models/ChartAccount';
import { NatureType } from '../../models/NatureType';
import { ClasificationType } from '../../models/ClasificationType';
import { FinancialStateType } from '../../models/FinancialStateType';
import { ChartAccountService } from '../../services/chart-account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.css'
})
export class AccountFormComponent implements OnInit{

  /**
   * main form information
   */
  @Input() currentLevelAccount: string = '';
  @Input() parentId: string = '';
  @Output() newAccount = new EventEmitter<Account>(); 
  @Output() cancelar = new EventEmitter<void>(); 

  listNature: NatureType[] = [];
  listFinancialState: FinancialStateType[] = [];
  listClasification: ClasificationType[] = [];

  /**
   * Formularios
   */
  formNewAccount: FormGroup;

  /**
   * select placeholder
   */
  placeNatureType: string = 'Seleccione una opción';
  placeFinancialStateType: string = 'Seleccione una opción';
  placeClassificationType: string = 'Seleccione una opción';

  /**
   * Message for maximum code length
   */
  messageLength: string = '';

  constructor(private _accountService: ChartAccountService, private fb: FormBuilder){
    //Se valida maximo tamaño del codigo dependiendo al nivel y se asigna el mensaje
    let codeMaxLength: number = 0;
    if(this.currentLevelAccount === 'clase' || this.currentLevelAccount === 'grupo'){
      codeMaxLength = 1;
      this.messageLength = 'un dígito';
    }
    else{
      codeMaxLength = 2;
      this.messageLength = 'dos dígitos';
    }

    this.formNewAccount = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(codeMaxLength), Validators.minLength(codeMaxLength)]],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      selectedNatureType: [''],
      selectedFinancialStateType: [''],
      selectedClassificationType: ['']
    });
  }

  /**
   * Inicio
   */
  ngOnInit(): void {
    this.getNatureType();
    this.getFinancialStateType();
    this.getClasificationType();
  }

  /**
   * 
   * @param control 
   * @returns 
   */
  requireValueSelected = (control: FormControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || value === '') {
      return { noValueSelected: true };
    }
    return null;
  };


  /**
   * Emit new account 
   */
  sendAccount() {
    const account: Account = {
      code: this.formNewAccount.value.code,
      description: this.formNewAccount.value.name,
      nature: this.formNewAccount.value.selectedNatureType,
      classification: this.formNewAccount.value.selectedFinancialStateType,
      financialStatus: this.formNewAccount.value.selectedClassificationType
    };
    this.newAccount.emit(account);
  }

  getNatureType() {
    this.listNature = this._accountService.getNatureType();
  }

  getFinancialStateType() {
    this.listFinancialState = this._accountService.getFinancialStateType();
  }

  getClasificationType() {
    this.listClasification = this._accountService.getClasificationType();
  }

  onSelectionFinancialStateType(event: any) {
    this.formNewAccount.get('selectedFinancialStateType')?.setValue(''+event.name);
    this.placeFinancialStateType = '';
  }

  onSelectionNatureType(event: any) {
    this.formNewAccount.get('selectedNatureType')?.setValue(''+event.name);
    this.placeNatureType = '';
  }

  onSelectionClasificationType(event: any) {
    this.formNewAccount.get('selectedClassificationType')?.setValue(''+event.name);
    this.placeClassificationType = '';
  }

  onSelectionFinancialStateTypeClear() {
    this.formNewAccount.value.selectedFinancialStateType = { id: -1, name: '' };
  }

  onSelectionNatureTypeClear() {
    this.formNewAccount.value.selectedNatureType = { id: -1, name: '' };
  }

  onSelectionclasificationTypeClear() {
    this.formNewAccount.value.selectedClasificationType = { id: -1, name: '' };
  }

  cancel(){
    this.cancelar.emit();
  }

}
