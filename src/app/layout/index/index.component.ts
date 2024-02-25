import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../../service/ingredient.service';
import { PlanService } from '../../service/plan.service';
import {Day} from '../../models/Day';
import {DayOfWeek} from '../../models/DayOfWeek';
import {EatingTime} from '../../models/EatingTime';
import {Plan} from '../../models/Plan';

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
planId: number;
plans: Plan[];
selectedPlanId: number;

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
        // Теперь мы предполагаем, что plansData это массив Plan объектов, а не один объект
        this.plans = plansData;
        // Установим selectedPlanId для первого плана в массиве по умолчанию, если планы существуют
        if (this.plans && this.plans.length > 0) {
          this.selectedPlanId = this.plans[0].planId;
        }
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

    // Находим текущий выбранный план по selectedPlanId из списка всех планов
    const currentPlan = this.plans.find(plan => plan.planId === this.selectedPlanId);

    // Если план найден, ищем в нем указанный день и прием пищи
    if (currentPlan) {
      const dayPlan = currentPlan.days.find(day =>
        day.day === backendDay && day.eatingTime === backendMeal
      );
      // Возвращаем найденные ингредиенты или пустой массив, если таковые отсутствуют
      return dayPlan ? dayPlan.ingredients : [];
    } else {
      // Если план не найден, возвращаем пустой массив
      return [];
    }
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
