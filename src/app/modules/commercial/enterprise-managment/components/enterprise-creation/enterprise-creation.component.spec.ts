import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnterpriseCreationComponent } from './enterprise-creation.component';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { EnterpriseService } from '../../services/enterprise.service'; // Importa el servicio real
import { MockEnterpriseService } from '../../services/mocks/MockEnterpriseService';
import { BrowserModule } from '@angular/platform-browser';

describe('EnterpriseCreationComponent', () => {
  let component: EnterpriseCreationComponent;
  let fixture: ComponentFixture<EnterpriseCreationComponent>;
  let enterpriseServiceMock: MockEnterpriseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserModule, ReactiveFormsModule, HttpClientModule, NgSelectModule,    FormsModule],
      declarations: [EnterpriseCreationComponent],
      providers: [
        { provide: EnterpriseService, useClass: MockEnterpriseService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EnterpriseCreationComponent);
    component = fixture.componentInstance;
    enterpriseServiceMock = TestBed.inject(EnterpriseService); // Inyecta el mock del servicio
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form groups', () => {
    expect(component.form).toBeTruthy();
    expect(component.form_legal).toBeTruthy();
    expect(component.form_natural).toBeTruthy();
  });

  it('should initialize default values', () => {
    expect(component.selectedButtonType).toEqual('LEGAL_PERSON');
    expect(component.showLegalForm).toBeTrue();
    expect(component.showNaturalForm).toBeFalse();
    expect(component.enabledSelectCity).toBeFalse();
  });

  it('should show legal person form', () => {
    component.showNaturalPersonForm();
    expect(component.showLegalForm).toBeFalse();
    expect(component.showNaturalForm).toBeTrue();
    expect(component.selectedButtonType).toEqual('NATURAL_PERSON');

    component.showLegalPersonForm();
    expect(component.showLegalForm).toBeTrue();
    expect(component.showNaturalForm).toBeFalse();
    expect(component.selectedButtonType).toEqual('LEGAL_PERSON');
  });

  it('should check branch status correctly', () => {
    component.form.value.branchSelected = false;
    expect(component.checkBranch()).toEqual(0);

    component.form.value.branchSelected = true;
    expect(component.checkBranch()).toEqual(1);
  });

  describe('Form validations', () => {
    /*
    it('should return false if form is invalid', () => {
      component.form.get('name')?.setValue('');
      component.form.get('nit')?.setValue('');
      component.showLegalPersonForm();
      component.form.get('address')?.setValue('');
      component.form.get('phone')?.setValue('');
      component.form.get('email')?.setValue('');
      component.form
        .get('department')
        ?.setValue(null);
      component.form
        .get('selectedItemEnterpriseType')
        ?.setValue(null);
      component.form
        .get('selectedItemTaxPayer')
        ?.setValue(null);
      component.form
        .get('selectedItemTaxLiabilities')
        ?.setValue([null]);
      component.form
        .get('selectedItemCity')
        ?.setValue(null);
      component.showLegalPersonForm();
      component.form_legal.get('businessName')?.setValue('');

      expect(component.validationsForm()).toBeFalse();
    });*/

    it('should return true if form is valid', () => {
      component.form.get('name')?.setValue('Empresa');
      component.form.get('nit')?.setValue('123456789');
      component.form.get('address')?.setValue('Calle 123');
      component.form.get('phone')?.setValue('1234567890');
      component.form.get('email')?.setValue('email@example.com');
      component.form
        .get('department')
        ?.setValue({ id: 1, name: 'Departamento' });
      component.form
        .get('selectedItemEnterpriseType')
        ?.setValue({ id: 1, name: 'Tipo de empresa' });
      component.form
        .get('selectedItemTaxPayer')
        ?.setValue({ id: 1, name: 'Tipo de contribuyente' });
      component.form
        .get('selectedItemTaxLiabilities')
        ?.setValue([{ id: 1, name: 'Responsabilidad' }]);
      component.form
        .get('selectedItemCity')
        ?.setValue({ id: 1, name: 'Ciudad' });
      component.showLegalPersonForm();
      component.form_legal.get('businessName')?.setValue('Razón Social');

      expect(component.validationsForm()).toBeTrue();
    });
  });

  /*

  describe('Save enterprise', () => {
    let enterpriseServiceSpy: jasmine.Spy;

    beforeEach(() => {
      enterpriseServiceSpy = spyOn(
        enterpriseServiceMock,
        'createEnterprise'
      ).and.callThrough();

      // Configurar los valores del formulario
      component.form.get('name')?.setValue('Empresa');
      component.form.get('nit')?.setValue('123456789');
      component.form.get('address')?.setValue('Calle 123');
      component.form.get('phone')?.setValue('1234567890');
      component.form.get('country')?.setValue('1');
      component.form.get('email')?.setValue('email@example.com');
      component.form
        .get('department')
        ?.setValue({ id: 1, name: 'Departamento' });
      component.form.get('dv')?.setValue('1');
      component.form
        .get('selectedItemEnterpriseType')
        ?.setValue({ id: 1, name: 'Tipo de empresa' });
      component.form
        .get('selectedItemTaxPayer')
        ?.setValue({ id: 1, name: 'Tipo de contribuyente' });
      component.form
        .get('selectedItemTaxLiabilities')
        ?.setValue([{ id: 1, name: 'Responsabilidad' }]);
      component.form
        .get('selectedItemCity')
        ?.setValue({ id: 1, name: 'Ciudad' });
      component.showLegalPersonForm();
      component.form_legal.get('businessName')?.setValue('Razón Social');
      component.form.value.branchSelected = true;
    });

    it('should call createEnterprise service with correct data', () => {
      component.saveEnterprise();

      expect(enterpriseServiceSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          name: 'Empresa',
          nit: '123456789',
          phone: '1234567890',
          branch: '1',
          email: 'email@example.com',
          taxLiabilities: [1],
          taxPayerType: 1,
          personType: jasmine.objectContaining({
            type: 'LEGAL_PERSON',
            businessName: 'Razón Social',
          }),
          location: jasmine.objectContaining({
            address: 'Calle 123',
            country: 1,
            department: 1,
            city: 1,
          }),
          dv: '1',
          enterpriseType: 1
        })
      );
    });

    it('should not call createEnterprise service if form is invalid', () => {
      component.form.get('name')?.setValue('');
      component.saveEnterprise();
      expect(enterpriseServiceSpy).not.toHaveBeenCalled();
    });
  });*/
});
