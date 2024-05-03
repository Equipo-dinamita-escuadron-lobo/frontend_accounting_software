import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css'
})
export class CategoryDetailsComponent {
  inputData: any;
  categoryData: any = {
    id: '',
    name: '',
    description: '',
    creationDate: new Date(),
    enterpriseId: '',
    state: ''
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CategoryDetailsComponent>,
    private formBuilder: FormBuilder,
    private service: CategoryService
  ) { }

  ngOnInit(): void {
    this.inputData = this.data;
    console.log(this.inputData);
    if (this.inputData.categoryId > 0) {
      this.service.getCategoryById(this.inputData.categoryId).subscribe(
        category => {
          this.categoryData = category;
        });
    }
    console.log(this.categoryData);
  }

  closePopup(): void {
    this.dialogRef.close('closing from modal details');
  }

}


