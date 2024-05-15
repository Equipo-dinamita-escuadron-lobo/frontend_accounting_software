import { Component, OnInit } from '@angular/core';
import { UnitOfMeasure } from '../../models/UnitOfMeasure';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UnitOfMeasureService } from '../../services/unit-of-measure.service';
import { error } from 'jquery';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import Swal from 'sweetalert2';

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
      // Utilizando SweetAlert para mostrar un cuadro de diálogo de confirmación
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Estás seguro de que deseas eliminar esta elemento?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        // Si el usuario confirma la eliminación
        if (result.isConfirmed) {
          this.unitOfMeasureService.deleteUnitOfMeasureId(unitId).subscribe(
            (data: UnitOfMeasure) => {
              console.log('Unidad de medida eliminada con éxito: ', data);
              this.getUnitOfMeasures();
              Swal.fire({
                title: 'Se eliminó con éxito!',
                text: 'Se ha eliminado la Unidad de medida con éxito!',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
            },
            error => {
              console.error('Error al eliminar la unidad de medida:', error);
              Swal.fire({
                title: 'No se puede eliminar ',
                text: 'La unidad de medida esta siendo usada',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
              });
            }
          );
        }
      });
    }
    

    goBack(): void {
      this.router.navigate(['/general/operations/products']);
    }

}
