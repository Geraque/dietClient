import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../../service/ingredient.service';
import { PlanService } from '../../service/plan.service';
import { UserService } from '../../service/user.service';
import { HistoryService } from '../../service/history.service';
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
  isDietician: boolean = false;
  newPlanName: string = '';
showPublishModal: boolean = false;
userName: string;
week: number;
date: string;
showCopyModal: boolean = false;
copyPlanId: number;

constructor(
  private ingredientService: IngredientService,
  private planService: PlanService,
  private userService: UserService,
  private historyService: HistoryService) {}

  ngOnInit() {
    this.checkIfDietician();
    this.getIngredients();
    this.getPlans();
    this.initializeAmounts();
  }
  //Метод для открытия модального окна копирования:
  openCopyModal(): void {
    this.showCopyModal = true;
  }

  // Метод для закрытия модального окна копирования:
  closeCopyModal(): void {
    this.showCopyModal = false;
  }


  //Метод копирования плана:
  copyPlan(): void {
    if (!this.copyPlanId) {
      alert("Выберите план для копирования.");
      return;
    }
    this.planService.copy(this.selectedPlanId.toString(), this.copyPlanId.toString()).subscribe({
      next: (response) => {
        console.log("План успешно скопирован:", response);
        this.showCopyModal = false;  // Закрытие модального окна после копирования
        this.getPlans();  // Обновление списка планов
      },
      error: (error) => {
        console.error("Ошибка при копировании плана:", error);
      }
    });
  }

  // Метод для открытия модального окна
  openPublishModal(): void {
    this.showPublishModal = true;
  }

  // Метод для закрытия модального окна
  closeModal(): void {
    this.showPublishModal = false;
  }

  publishPlan(): void {
    if (this.userName && this.week && this.date) {
      this.planService.ready(this.selectedPlanId, this.userName, this.week, this.date).subscribe({
        next: (response) => {
          console.log('План успешно опубликован:', response);
          this.closeModal();
        },
        error: (error) => {
          console.error('Ошибка при публикации плана:', error);
        }
      });
    } else {
      alert("Пожалуйста, заполните все поля.");
    }
  }

  checkIfDietician() {
    // Подставьте актуальный идентификатор пользователя
    this.userService.isDiet().subscribe({
      next: (data) => {
        this.isDietician = data; // предполагается, что ответом является boolean
      },
      error: (error) => {
        console.error('Ошибка при проверке пользователя:', error);
      }
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

  check(planId: number, day: DayOfWeek, meal: EatingTime, ingredient: any, count: number) {
      this.planService.check(planId, day, meal, ingredient, count).subscribe(
        response => {
          console.log('Ингредиент check:', response);
          // Тут можно добавить логику обновления UI
          this.updateIngredientsForDayAndMeal(day, meal);
        },
        error => {
          console.error('Ошибка при check ингредиента:', error);
        }
      );
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

  enableEdit(ingredientDay: any) {
      ingredientDay.editing = true;
      // Здесь также можно проинициализировать селектор со значением ингредиента, если нужно.
      ingredientDay.selectedIngredient = ingredientDay.ingredient;
  }

  updateIngredient(planId: number, dayOfWeek: DayOfWeek, eatingTime: EatingTime, ingredientOld: any, ingredientNew: any, count: number, comment: string) {
      if (count > 0 && ingredientNew) {
          this.planService.update(planId, dayOfWeek, eatingTime, ingredientOld.name, ingredientNew.name, count, comment).subscribe(
              response => {
                  console.log('Ингредиент обновлен:', response);
                  // Здесь можно обновить UI соответствующим образом
                  this.updateIngredientsForDayAndMeal(dayOfWeek, eatingTime);
              },
              error => {
                  console.error('Ошибка при обновлении ингредиента:', error);
              }
          );
      } else {
          console.error('Ингредиент не выбран или количество указано не верно.');
      }
  }

    toggleIngredientDetails(planId: number, dayOfWeek: DayOfWeek, eatingTime: EatingTime, ingredientDay: any) {
    if (ingredientDay.showDetails) {
      ingredientDay.showDetails = false;
    } else {
      this.historyService.last(planId, dayOfWeek, eatingTime, ingredientDay.ingredient.name).subscribe({
        next: (data) => {
          ingredientDay.countT = data.countOld
          ingredientDay.name = data.ingredientOld.name
          ingredientDay.comment = data.comment
          ingredientDay.showDetails = true;
        },
        error: (error) => {
          console.error('Ошибка при получении дополнительной информации об ингредиенте:', error);
        }
      });
    }
  }

  // Добавляем функцию для создания нового плана
  createPlan() {
    if (!this.newPlanName.trim()) {
      console.error('Название плана не может быть пустым.');
      return;
    }

    this.planService.createPlan(this.newPlanName).subscribe({
      next: (plan) => {
        console.log('План создан:', plan);
        this.getPlans(); // Обновляем список планов
        this.selectedPlanId = plan.planId; // Устанавливаем созданный план как выбранный
      },
      error: (error) => {
        console.error('Ошибка при создании плана:', error);
      }
    });
  }

  translateEnglishToRussianDay(englishDay: string): string {
    const daysMapping: { [key: string]: string } = {
      'MONDAY': 'ПОНЕДЕЛЬНИК',
      'TUESDAY': 'ВТОРНИК',
      'WEDNESDAY': 'СРЕДА',
      'THURSDAY': 'ЧЕТВЕРГ',
      'FRIDAY': 'ПЯТНИЦА',
      'SATURDAY': 'СУББОТА',
      'SUNDAY': 'ВОСКРЕСЕНЬЕ'
    };
    return daysMapping[englishDay] || '';
  }
}
