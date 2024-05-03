import { Component, OnInit } from '@angular/core';
import { UnitOfMeasure } from '../../models/UnitOfMeasure';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UnitOfMeasureService } from '../../services/unit-of-measure.service';
import { error } from 'jquery';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';

@Component({
  selector: 'app-unit-of-measure-list',
  templateUrl: './unit-of-measure-list.component.html',
  styleUrl: './unit-of-measure-list.component.css'
})
export class UnitOfMeasureListComponent implements OnInit {
 unitOfMeasures: UnitOfMeasure[] = [];
 localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
 entData: any | null = null;
  columns: any[] = [
    {title: 'Id', data: 'id'},
    {title: 'Nombre', data: 'name'},
    {title: 'Descripción', data: 'description'},    
    {title: 'Abreviatura', data: 'abbreviation'},
    {title: 'Acciones', data: 'actions'}
  ];

  form: FormGroup;

  //variables para el doble clic
  selectedUnitId: string | null = null;
  timer: any;
  constructor(
    private unitOfMeasureService: UnitOfMeasureService,
    private router: Router, private fb: FormBuilder
  ){
    this.form = this.fb.group(this.validationsAll());
   }

   validationsAll(){
    return {
      stringSearchUnitOfMeasure: ['']
    };
  }
  ngOnInit(): void {
    this.entData = this.localStorageMethods.loadEnterpriseData();
    if(this.entData){
    this.getUnitOfMeasures();
    }
  }

  getUnitOfMeasures(): void {
    this.unitOfMeasureService.getUnitOfMeasures(this.entData.entId).subscribe(
      (data: UnitOfMeasure[]) => {
        this.unitOfMeasures = data;
      },
      error => {
        console.log('Erro al obtener las unidades de medida:', error);
      }
    );
  }

    // Método para redirigir a una ruta específica
    redirectTo(route: string): void {
      this.router.navigateByUrl(route);
    }
    redirectToEdit(unitId: string): void {
      if (this.selectedUnitId === unitId) {
        // Doble clic, navegar a la página de edición
        this.router.navigate(['/general/operations/unities/edit/', unitId]);
        // Reiniciar el temporizador y el ID del producto seleccionado
        clearTimeout(this.timer);
        this.selectedUnitId = null;
      } else {
        // Primer clic, iniciar el temporizador
        this.selectedUnitId = unitId;
        this.timer = setTimeout(() => {
          // Limpiar el temporizador si pasa un tiempo después del primer clic
          clearTimeout(this.timer);
          this.selectedUnitId = null;
        }, 300); // Tiempo en milisegundos para considerar un doble clic
      }
    }

    redirectToDelete(unitId: string): void {
      // Aquí puedes mostrar un cuadro de diálogo de confirmación antes de eliminar
      if (confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
        this.unitOfMeasureService.deleteUnitOfMeasureId(unitId).subscribe(
          (data: UnitOfMeasure) => {
            console.log('Unidad de medida eliminada con éxito: ', data);
            this.getUnitOfMeasures();
          },
          error => {
            console.error('Error al eliminar la unidad de medida:', error);
          }
        );
      }
    }
    

    goBack(): void {
      this.router.navigate(['/general/operations/products']);
    }

}
