import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../../service/ingredient.service';
import { PlanService } from '../../service/plan.service';
import {Day} from '../../models/Day';
import * as moment from 'moment';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {
  currentDate: Date = new Date();
  mealsToday: Day[]
  totalProteins = 0;
  totalFats = 0;
  totalCarbohydrates = 0;
  totalCalories = 0;

constructor(private planService: PlanService) {}

  ngOnInit() {
    this.loadMealsForToday();
  }

  loadMealsForToday() {
    this.planService.getTodayForCurrentUser().subscribe(days => {
      // Фильтруем, чтобы получить только сегодняшние приемы пищи
      const todayMeals = days;
      console.log("days " + days)

      todayMeals.forEach(meal => {
        console.log("meal " + meal)
        console.log("meal.dayId " + meal.dayId)
        meal.ingredients.forEach(ingredient => {
          this.totalProteins += ingredient.ingredient.proteins * ingredient.count;
          this.totalFats += ingredient.ingredient.fat * ingredient.count;
          this.totalCarbohydrates += ingredient.ingredient.carbohydrates * ingredient.count;
          this.totalCalories += ingredient.ingredient.calories * ingredient.count;
        });
      });

      this.mealsToday = todayMeals;
    });
  }
}
