import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/Category';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css'
})
export class CategoryEditComponent implements OnInit{
categoryId: string = '';
category: Category = {} as Category;
editForm: FormGroup;

constructor(
  private route: ActivatedRoute,
  private categoryService: CategoryService,
  private formBuilder: FormBuilder,
  private router: Router
) {
  this.editForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    inventory: ['', Validators.required],
    cost: ['', Validators.required],
    sale: ['', Validators.required],
    return: ['', Validators.required]
  });
}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      this.getCategoryDetails();
    });
  }

  getCategoryDetails(): void {
    this.categoryService.getCategoryById(this.categoryId).subscribe(
      (category: Category) => {
        this.category = category;
        this.editForm.patchValue({
          name: category.name,
          description: category.description,
          inventory: category.inventory,
          cost: category.cost,
          sale: category.sale,
          return: category.return
        });
      },
      error => {
        console.error('Error getting category details: ', error);
      }
    );
    console.log('Category details: ', this.category);
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      this.categoryService.updateCategory( this.editForm.value).subscribe(
        (category: Category) => {
          console.log('Category updated successfully: ', category);
        },
        error => {
          console.error('Error updating category: ', error);
        }
      );
    }
  }
  
  goBack(): void {
    //this.router.navigate(['../../'], { relativeTo: this.route });
    this.router.navigate(['/general/operations/categories']);
  }
}
