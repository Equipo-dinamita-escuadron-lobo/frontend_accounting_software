import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { Inject } from '@angular/core';

/**
 * Componente para mostrar los detalles de una categoría
 */
@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css'
})
export class CategoryDetailsComponent {
  /**
   * Variables del componente
   */
  inputData: any; // Variable para almacenar los datos de entrada
  categoryData: any = { // Variable para almacenar los datos de la categoría
    id: '',
    name: '',
    description: '',
    creationDate: new Date(),
    enterpriseId: '',
    state: ''
  };
  /**
   * Constructor del componente
   * @param data 
   * @param dialogRef 
   * @param formBuilder 
   * @param service 
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CategoryDetailsComponent>,
    private formBuilder: FormBuilder,
    private service: CategoryService
  ) { }

  /**
   * Método para inicializar el componente
   */
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


