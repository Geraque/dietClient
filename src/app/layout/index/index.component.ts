import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../../service/ingredient.service';
import { PlanService } from '../../service/plan.service';

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
plans = [];

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
      data => {
        this.plans = data[0]; // Предполагаем, что возвращается массив дней
        console.log(`Added ${data[0].days[0].ingredients[0].ingredient.name}`);
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
      // Преобразование енума в строку, соответствующую тем, что приходит с бекенда

      const backendDay = dayOfWeek.toUpperCase();
      const backendMeal = eatingTime.toUpperCase();
      console.log(`Added2 ${this.plans[0]}`);

      // Поиск соответствующего плана
      const dayPlan = this.plans.find(plan =>
        plan.day === backendDay && plan.eatingTime === backendMeal
      );
      return dayPlan ? dayPlan.ingredients : [];
  }

  isPlanForDayAndMeal(plan: any, day: DayOfWeek, meal: EatingTime): boolean {
    const backendDay = day.toUpperCase();
    const backendMeal = meal.toUpperCase();
    return plan.day === backendDay && plan.eatingTime === backendMeal;
  }
}
