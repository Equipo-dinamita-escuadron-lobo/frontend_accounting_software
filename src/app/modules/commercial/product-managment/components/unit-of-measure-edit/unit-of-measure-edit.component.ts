import { Component, OnInit } from '@angular/core';
import { UnitOfMeasure } from '../../models/UnitOfMeasure';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitOfMeasureService } from '../../services/unit-of-measure.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-unit-of-measure-edit',
  templateUrl: './unit-of-measure-edit.component.html',
  styleUrl: './unit-of-measure-edit.component.css'
})
export class UnitOfMeasureEditComponent implements OnInit{
  unitOfMeasureId: string = '';
  unitOfMeasure: UnitOfMeasure = {} as UnitOfMeasure;
  editForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private unitOfMeasureService: UnitOfMeasureService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.unitOfMeasureId = params['id'];
      this.unitOfMeasureDetails();
    });
  }
  unitOfMeasureDetails(): void {
    this.unitOfMeasureService.getUnitOfMeasuresId(this.unitOfMeasureId).subscribe(
      (unitOfMeasure: UnitOfMeasure) => {
        this.unitOfMeasure = unitOfMeasure;
        this.editForm.patchValue({
          name: unitOfMeasure.name,
          description: unitOfMeasure.description,
          return: unitOfMeasure.abbreviation
        });
      },
      error => {
        console.error('Error getting unit Of Measure details: ', error);
      }
    );
    console.log('unit Of Measure details: ', this.unitOfMeasure);
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      this.unitOfMeasureService.updateUnitOfMeasure(this.unitOfMeasureId, this.editForm.value).subscribe(
        (unitOfMeasure: UnitOfMeasure) => {
          console.log('Category updated successfully: ', unitOfMeasure);
        },
        error => {
          console.error('Error updating unit Of Measure: ', error);
        }
      );
    }
  }
  goBack(): void {
    this.router.navigate(['/unitOfMeasure-list']);
  }

}
