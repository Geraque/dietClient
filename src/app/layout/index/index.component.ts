import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../../service/ingredient.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
meals = ['Завтрак', 'Обед', 'Ужин'];
ingredients = [];
selectedAmount = {};

constructor(private ingredientService: IngredientService) {}

    ngOnInit() {
        this.getIngredients();
        this.initializeAmounts();
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

    initializeAmounts() {
        for (let day of this.days) {
            this.selectedAmount[day] = {};
            for (let meal of this.meals) {
                this.selectedAmount[day][meal] = 1; // Default value for inputs
            }
        }
    }

    onSelectIngredient(event, day, meal) {
        // Handle ingredient selection
        // You may want to store selected ingredient ID in the selectedAmount object
    }

    addIngredient(day, meal) {
        const amount = this.selectedAmount[day][meal];
        // Code to add the ingredient to the day's meal with the amount
        console.log(`Added ${amount} of ingredient to ${meal} on ${day}`);
    }
}
