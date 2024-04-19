import { Component, OnInit } from '@angular/core';
import { UnitOfMeasure } from '../../models/UnitOfMeasure';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UnitOfMeasureService } from '../../services/unit-of-measure.service';

@Component({
  selector: 'app-unit-of-measure-list',
  templateUrl: './unit-of-measure-list.component.html',
  styleUrl: './unit-of-measure-list.component.css'
})
export class UnitOfMeasureListComponent implements OnInit {
 unitOfMeasures: UnitOfMeasure[] = [];
  columns: any[] = [
    {title: 'Id', data: 'id'},
    {title: 'Nombre', data: 'name'},
    {title: 'Descripción', data: 'description'}
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
    this.getUnitOfMeasures();
  }

  getUnitOfMeasures(): void {
    this.unitOfMeasureService.getUnitOfMeasures().subscribe(
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
        this.router.navigate(['/unitOfMeasure-edit', unitId]);
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
    goBack(): void {
      this.router.navigate(['product-list']);
    }

}
