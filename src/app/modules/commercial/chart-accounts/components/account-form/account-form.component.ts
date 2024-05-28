import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account } from '../../models/ChartAccount';
import { NatureType } from '../../models/NatureType';
import { ClasificationType } from '../../models/ClasificationType';
import { FinancialStateType } from '../../models/FinancialStateType';
import { ChartAccountService } from '../../services/chart-account.service';

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
  @Input() parentId?: string = '';
  @Input() level: number = 0;
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

  constructor(private _accountService: ChartAccountService, private fb: FormBuilder) {
    this.formNewAccount = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1]+[a-zA-ZÀ-ÿ\u00f1\u00d1\\d,.()\\/\\-+&% ]*$')]],
      selectedNatureType: [''],
      selectedFinancialStateType: [''],
      selectedClassificationType: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['level']) {
      const validators = [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.maxLength(this.level),
        Validators.minLength(this.level)
      ];
      this.formNewAccount.get('code')?.setValidators(validators);
      this.formNewAccount.get('code')?.updateValueAndValidity();
    }
  }

  /**
   * Inicio
   */
  ngOnInit(): void {
    this.getNatureType();
    this.getFinancialStateType();
    this.getClasificationType();
    this.asignMessage();
  }

  asignMessage(){
    if(this.level === 1){
      this.messageLength = 'un dígito';
    }
    else{
      this.messageLength = 'dos dígitos';
    }
  }


  /**
   * Emit new account 
   */
  sendAccount() {
    const account: Account = {
      idEnterprise: this.getIdEnterprise(),
      code: this.formNewAccount.value.code,
      description: this.formNewAccount.value.name,
      nature: this.formNewAccount.value.selectedNatureType,
      classification: this.formNewAccount.value.selectedClassificationType,
      financialStatus: this.formNewAccount.value.selectedFinancialStateType,
      parent: 0,
    };
    this.newAccount.emit(account);
  }

  getIdEnterprise(): string{
    const entData = localStorage.getItem('entData');
    if(entData){
      return JSON.parse(entData).entId;
    }
    return '';
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
