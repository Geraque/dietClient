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
showChangeModal: boolean = false;
showDeleteModal: boolean = false;
  public publishForm: FormGroup;
  public changeForm: FormGroup;
public deleteForm: FormGroup;

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

  // Метод для открытия модального окна
  openChangeModal(): void {
    this.showChangeModal = true;
    this.changeForm = this.createChangeForm();
  }

  // Метод для закрытия модального окна
  closeChangeModal(): void {
    this.showChangeModal = false;
  }

  // Метод для открытия модального окна
  openDeleteModal(): void {
    this.showDeleteModal = true;
    this.deleteForm = this.createDeleteForm();
  }

  // Метод для закрытия модального окна
  closeDeleteModal(): void {
    this.showDeleteModal = false;
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

  createChangeForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      calories: ['', Validators.compose([Validators.required])],
      carbohydrates: ['', Validators.compose([Validators.required])],
      proteins: ['', Validators.compose([Validators.required])],
      fat: ['', Validators.compose([Validators.required])],
    });
  }

  createDeleteForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.compose([Validators.required])],
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
          this.notificationService.showSnackBar('Заполните поля валидными данными');
          console.error('Ошибка при добавлении ингредиента:', error);
        }
      });
    } else {
      alert("Пожалуйста, заполните все поля.");
    }
  }

  changeIngredient(): void {
    if (this.changeForm.valid) {
      const { calories, carbohydrates, fat, name, proteins } = this.changeForm.value;
      this.ingredientService.change(calories, carbohydrates, fat, name, proteins).subscribe({
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

  deleteIngredient(): void {
    if (this.deleteForm.valid) {
      const { name } = this.deleteForm.value;
      this.ingredientService.delete(name).subscribe({
        next: (response) => {
          this.notificationService.showSnackBar('Ингредиент удалён');
          console.log('Ингредиент успешно удалён:', response);
          this.closeModal();
          this.getIngredients(); // обновить список ингредиентов
        },
        error: (error) => {
          this.notificationService.showSnackBar('Ингредиент с таким названием отсутствует');
          console.error('Ошибка при добавлении ингредиента:', error);
        }
      });
    } else {
      alert("Пожалуйста, заполните все поля.");
    }
  }
}
