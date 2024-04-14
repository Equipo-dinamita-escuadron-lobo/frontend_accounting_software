import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitOfMeasureService } from '../../services/unit-of-measure.service';

@Component({
  selector: 'app-unit-of-measure-creation',
  templateUrl: './unit-of-measure-creation.component.html',
  styleUrl: './unit-of-measure-creation.component.css'
})
export class UnitOfMeasureCreationComponent implements OnInit{
  unitOfMeasureForm: FormGroup = this.formBuilder.group({});
  
  constructor(
    private formBuilder: FormBuilder,
    private unitOfMeasureService: UnitOfMeasureService,
    
  ) {}

  ngOnInit(): void {
    this.unitOfMeasureForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }
  
  onSubmit(): void {
    if (this.unitOfMeasureForm.valid) {
      this.unitOfMeasureService.createUnitOfMeasure(this.unitOfMeasureForm.value).subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

}
