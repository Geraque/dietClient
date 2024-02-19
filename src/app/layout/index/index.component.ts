import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../../service/ingredient.service';
import { PlanService } from '../../service/plan.service';
import {Day} from '../../models/Day';

enum DayOfWeek {
MONDAY = 'Понедельник',
TUESDAY = 'Вторник',
WEDNESDAY = 'Среда',
THURSDAY = 'Четверг',
FRIDAY = 'Пятница',
SATURDAY = 'Суббота',
SUNDAY = 'Воскресенье'
}

enum EatingTime {
BREAKFAST = 'Завтрак',
LUNCH = 'Обед',
DINNER = 'Ужин'
}

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

  addIngredient(day: string, meal: string) {
    // Добавление выбранных ингредиентов с указанным количеством
  }

    // Функция для получения ингредиентов с учетом дня недели и приема пищи
  getIngredientsForDayAndMeal(dayOfWeek: DayOfWeek, eatingTime: EatingTime) {
    const backendDay = dayOfWeek.toUpperCase();
    const backendMeal = eatingTime.toUpperCase();
    console.log(`Added22 ${this.plans[0].day}`);
    const dayPlan = this.plans.find(plan =>
      plan.day === backendDay && plan.eatingTime === backendMeal
    );
    return dayPlan ? dayPlan.dayId : [];
    dayPlan.dayId
  }
}
