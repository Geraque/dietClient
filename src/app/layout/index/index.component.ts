import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../../service/ingredient.service';
import { PlanService } from '../../service/plan.service';
import {Day} from '../../models/Day';
import {DayOfWeek} from '../../models/DayOfWeek';
import {EatingTime} from '../../models/EatingTime';

@Component({
selector: 'app-index',
templateUrl: './index.component.html',
styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
daysOfWeek = Object.values(DayOfWeek);
eatingTimes = Object.values(EatingTime);
ingredients = [];
selectedAmount = {};
plans: Day[];
planId: number;

constructor(private ingredientService: IngredientService, private planService: PlanService) {}

  ngOnInit() {
    this.getIngredients();
    this.getPlans();
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

  getPlans() {
    this.planService.getPlansForCurrentUser().subscribe(
      plansData => {
        // Здесь предполагается что plansData это массив из одного Plan объекта
        const currentPlan = plansData[0];
        console.log(`Added ${plansData[0].days[0].ingredients[0].ingredient.name}`);
        this.plans = currentPlan.days;
        this.planId = currentPlan.planId;
      },
      error => {
        console.error(error);
      }
    );
  }

  initializeAmounts() {
    this.daysOfWeek.forEach(day => {
      this.selectedAmount[day] = {};
      this.eatingTimes.forEach(meal => {
        this.selectedAmount[day][meal] = 0;
      });
    });
  }

  addIngredient(planId: number, day: DayOfWeek, meal: EatingTime, ingredient: any, count: number) {
    console.log('planId:', planId);
    console.log('day:', day);
    console.log('meal:', meal);
    console.log('ingredient:', ingredient);
    console.log('count:', count);
    if (count > 0 && ingredient) {
      this.planService.addIngredient(planId, day, meal, ingredient, count).subscribe(
        response => {
          console.log('Ингредиент добавлен:', response);
          // Тут можно добавить логику обновления UI
          this.updateIngredientsForDayAndMeal(day, meal);
        },
        error => {
          console.error('Ошибка при добавлении ингредиента:', error);
        }
      );
    } else {
      console.error('Ингредиент не выбран или количество указано не верно.');
    }
  }

    // Функция для получения ингредиентов с учетом дня недели и приема пищи
  getIngredientsForDayAndMeal(dayOfWeek: DayOfWeek, eatingTime: EatingTime) {
    const backendDay = dayOfWeek.toUpperCase();
    const backendMeal = eatingTime.toUpperCase();
    const dayPlan = this.plans.find(plan =>
      plan.day === backendDay && plan.eatingTime === backendMeal
    );
    return dayPlan ? dayPlan.ingredients : [];
  }

  updateIngredientsForDayAndMeal(day: DayOfWeek, meal: EatingTime) {
    // Обновляем список ингредиентов для данного дня и приема пищи.
    // Для этого можно перезапросить данные у сервера или обновить локальный this.plans
    this.getPlans(); // Пример обновления данных через запрос к серверу
    // Альтернативно локальное обновление (без запроса к серверу) может выглядеть как-то так:
    // const updatedPlanDay = this.plans.find(planDay => planDay.day === day && planDay.meal === meal);
    // if (updatedPlanDay) {
    //   updatedPlanDay.ingredients.push({ /* Данные нового ингредиента */ });
    // }
  }
}
