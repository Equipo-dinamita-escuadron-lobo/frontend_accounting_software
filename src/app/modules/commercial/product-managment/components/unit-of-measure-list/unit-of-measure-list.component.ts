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
  constructor(private unitOfMeasureService: UnitOfMeasureService,  private router: Router, private fb: FormBuilder ) {
    this.form = this.fb.group(this.validationsAll());
   }

   validationsAll(){
    return {
      stringSearch: ['']
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
        console.log('Error al obtener las unidades de medida:', error);
      }
    );
  }

    // Método para redirigir a una ruta específica
    redirectTo(route: string): void {
      this.router.navigateByUrl(route);
    }
    redirectToEdit(unitId: string): void {
      console.log('ID de la unidad seleccionada:', unitId);
      this.router.navigate(['/unitOfMeasure-edit', unitId]);
    }

}
