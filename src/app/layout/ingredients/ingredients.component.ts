import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { IngredientService } from '../../service/ingredient.service';
import {Ingredient} from '../../models/Ingredient';
import {NotificationService}from '../../service/notification.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit{
  ingredients: Ingredient[] = [];
  showPublishModal: boolean = false;
  public publishForm: FormGroup;

constructor(private ingredientService: IngredientService,
  private notificationService: NotificationService,
  private fb: FormBuilder) {}

  ngOnInit() {
    this.getIngredients();
  }

  // Метод для открытия модального окна
  openPublishModal(): void {
    this.showPublishModal = true;
    this.publishForm = this.createPublishForm();
  }

  // Метод для закрытия модального окна
  closeModal(): void {
    this.showPublishModal = false;
  }

  createPublishForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      calories: ['', Validators.compose([Validators.required])],
      carbohydrates: ['', Validators.compose([Validators.required])],
      proteins: ['', Validators.compose([Validators.required])],
      fat: ['', Validators.compose([Validators.required])],
    });
  }

    getIngredients() {
        this.ingredientService.getAllRecipes().subscribe(
            data => {
                this.ingredients = data;
            },
            error => {
                console.error(error);
            }
        );
    }

  createIngredient(): void {
    if (this.publishForm.valid) {
      const { calories, carbohydrates, fat, name, proteins } = this.publishForm.value;
      this.ingredientService.create(calories, carbohydrates, fat, name, proteins).subscribe({
        next: (response) => {
          this.notificationService.showSnackBar('Ингредиент добавлен');
          console.log('Ингредиент успешно добавлен:', response);
          this.closeModal();
          this.getIngredients(); // обновить список ингредиентов
        },
        error: (error) => {
          console.error('Ошибка при добавлении ингредиента:', error);
        }
      });
    } else {
      alert("Пожалуйста, заполните все поля.");
    }
  }
}
