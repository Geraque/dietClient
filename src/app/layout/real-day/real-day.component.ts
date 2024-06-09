import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { IngredientService } from '../../service/ingredient.service';
import { PlanService } from '../../service/plan.service';
import { UserService } from '../../service/user.service';
import { HistoryService } from '../../service/history.service';
import {NotificationService}from '../../service/notification.service';
import {Day} from '../../models/Day';
import {RealDay} from '../../models/RealDay';
import {DayOfWeek} from '../../models/DayOfWeek';
import {EatingTime} from '../../models/EatingTime';
import {Plan} from '../../models/Plan';
import {saveAs} from 'file-saver';

import * as moment from 'moment';

@Component({
  selector: 'app-real-day',
  templateUrl: './real-day.component.html',
  styleUrls: ['./real-day.component.css']
})
export class RealDayComponent {
  daysOfWeek = Object.values(DayOfWeek);
  eatingTimes = Object.values(EatingTime);
  ingredients = [];
  selectedAmount = {};
  planId: number;
  plans: Plan[];
  selectedPlanId: number;
  isDietician: boolean = false;
  currentWeekStart: Date;
  currentWeekLabel: string;
  currentWeek: Map<string, string>;

  public editForm: FormGroup;
  showEditModal: boolean = false;
  editDay: DayOfWeek;
  editEatingTime: EatingTime;
  editIngredient: any;

  constructor(
    private ingredientService: IngredientService,
    private planService: PlanService,
    private userService: UserService,
    private historyService: HistoryService,
    private notificationService: NotificationService,
    private fb: FormBuilder) {}

    ngOnInit() {
      this.fillWeekMap();
      this.checkIfDietician();
      this.getIngredients();
      this.getPlans();
      this.initializeAmounts();
      this.setCurrentWeek(new Date());
    }

  openEditModal(dayOfWeek: DayOfWeek, eatingTime: EatingTime, ingredientOld: any): void {
    this.showEditModal = true;
    this.editForm = this.createEditForm();
    this.editDay = dayOfWeek;
    this.editEatingTime = eatingTime;
    this.editIngredient = ingredientOld;
  }

  // Метод для закрытия модального окна копирования:
  closeEditModal(): void {
    this.showEditModal = false;
  }

  createEditForm(): FormGroup {
    return this.fb.group({
      ingredientName: ['', Validators.compose([Validators.required])],
      countIngredient: ['', Validators.compose([Validators.required])],
      commentIngredient: ['', Validators.compose([Validators.required])],
    });
  }

  setCurrentWeek(date: Date) {
    const startOfWeek = this.getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000); // Добавляем 6 дней для получения конца недели
    this.currentWeekStart = startOfWeek;
    this.currentWeekLabel = `${startOfWeek.getDate()} ${this.getMonthName(startOfWeek.getMonth())} - ${endOfWeek.getDate()} ${this.getMonthName(endOfWeek.getMonth())}`;
    this.updateDisplayedDays();
  }

  showPreviousWeek() {
    this.replaceMapValuesWithLastWeekDates(this.currentWeek)
    const newDate = new Date(this.currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    this.setCurrentWeek(newDate);
  }

  showNextWeek() {
    this.replaceMapValuesWithNextWeekDates(this.currentWeek)
    const newDate = new Date(this.currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.setCurrentWeek(newDate);
  }

  getStartOfWeek(date: Date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day == 0 ? -6 : 1); // корректируем, если начало недели с воскресенья
    return new Date(date.setDate(diff));
  }

  getMonthName(monthIndex) {
    const monthNames = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
    return monthNames[monthIndex];
  }

  updateDisplayedDays() {
    // Здесь необходимо обновить логику отображения на странице, фильтруя `realDays` в выбранном плане по `currentWeekStart` и `currentWeekLabel`
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
      const date = this.getDayFromDayOfWeek(day)
      if (count > 0 && ingredient) {
        this.planService.addIngredientReal(planId, day, meal, ingredient, count, date).subscribe(
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
      const date = this.getDayFromDayOfWeek(day)
      this.planService.checkReal(planId, day, meal, ingredient, count, date).subscribe(
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
      const backendDayRussian = this.translateEnglishToRussianDay(backendDay);
      const backendMeal = eatingTime.toUpperCase();
      // Находим текущий выбранный план по selectedPlanId из списка всех планов
      const currentPlan = this.plans.find(plan => plan.planId === this.selectedPlanId);

      // Если план найден, ищем в нем указанный день и прием пищи
      if (currentPlan) {
        const dayPlan = currentPlan.realDays.find(day =>
          day.day === backendDay && day.eatingTime === backendMeal &&
          (day.date === this.currentWeek.get(backendDayRussian) || day.date === this.currentWeek.get(backendDay))
        );
        // Возвращаем найденные ингредиенты или пустой массив, если таковые отсутствуют
        return dayPlan ? dayPlan.ingredients : [];
      } else {
        // Если план не найден, возвращаем пустой массив
        return [];
      }
    }

    updateIngredientsForDayAndMeal(day: DayOfWeek, meal: EatingTime) {
      this.getPlans();
    }

    enableEdit(ingredientDay: any) {
        ingredientDay.editing = true;
        // Здесь также можно проинициализировать селектор со значением ингредиента, если нужно.
        ingredientDay.selectedIngredient = ingredientDay.ingredient;
    }

    updateIngredient() {
      const { ingredientName, countIngredient, commentIngredient} = this.editForm.value;
      const date = this.getDayFromDayOfWeek(this.editDay)
      if (countIngredient > 0 && ingredientName) {
        this.planService.updateReal(this.selectedPlanId, this.editDay, this.editEatingTime, this.editIngredient.ingredient.name, ingredientName, countIngredient, commentIngredient, date).subscribe(
            response => {
              this.notificationService.showSnackBar('Ингредиент изменён');
              console.log('Ингредиент обновлен:', response);
              // Здесь можно обновить UI соответствующим образом
              this.updateIngredientsForDayAndMeal(this.editDay, this.editEatingTime);
              this.closeEditModal()
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
      const date = this.getDayFromDayOfWeek(dayOfWeek)
      if (ingredientDay.showDetails) {
        ingredientDay.showDetails = false;
      } else {
        this.historyService.lastReal(planId, dayOfWeek, eatingTime, ingredientDay.ingredient.name, date).subscribe({
          next: (data) => {
            console.log('data.countOld:', data.countOld);
            console.log('data.ingredientOld.name:', data.ingredientOld.name);
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


  fillWeekMap() {
    const weekDatesMap = new Map<string, string>();
    const startOfWeek = moment().locale('ru').startOf('isoWeek');

    for (let i = 0; i < 7; i++) {
      const dayOfWeek = startOfWeek.clone().add(i, 'days');
      weekDatesMap.set(dayOfWeek.format('dddd').toUpperCase(), dayOfWeek.format('YYYY-MM-DD'));
    }

    this.currentWeek = weekDatesMap;
    console.log(this.currentWeek)
  }

  replaceMapValuesWithLastWeekDates(inputMap) {

    const startOfWeekMoment = this.getStartOfWeekDateFromMap(inputMap);
    const startOfLastWeek = startOfWeekMoment.subtract(7, 'days');

    const lastWeekDatesMap = new Map();

    for (let i = 0; i < 7; i++) {
      const dayOfLastWeek = startOfLastWeek.clone().add(i, 'days');
      lastWeekDatesMap.set(dayOfLastWeek.format('dddd').toUpperCase(), dayOfLastWeek.format('YYYY-MM-DD'));
    }

    inputMap.clear();
    lastWeekDatesMap.forEach((value, key) => {
      inputMap.set(key, value);
    });
    this.currentWeek = inputMap
    console.log(this.currentWeek)
  }

  replaceMapValuesWithNextWeekDates(inputMap) {
    const nextWeekDatesMap = new Map();
    const startOfWeekMoment = this.getStartOfWeekDateFromMap(inputMap);
    const startOfNextWeek = startOfWeekMoment.add(7, 'days');

    for (let i = 0; i < 7; i++) {
      const dayOfNextWeek = startOfNextWeek.clone().add(i, 'days');
      nextWeekDatesMap.set(dayOfNextWeek.format('dddd').toUpperCase(), dayOfNextWeek.format('YYYY-MM-DD'));
    }

    inputMap.clear();
    nextWeekDatesMap.forEach((value, key) => inputMap.set(key, value));
    this.currentWeek = inputMap
    console.log(this.currentWeek)
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

  getStartOfWeekDateFromMap(inputMap) {
    // Преобразуем карту в массив и извлекаем самую раннюю дату
    const dates = Array.from(inputMap.values()).sort();
    const startOfWeekDate = dates[0]; // Получаем начало недели, предполагая, что dates уже отсортирован
    return moment(startOfWeekDate, 'YYYY-MM-DD');
  }

  getDayFromDayOfWeek(day: DayOfWeek) {
    const date = this.translateEnglishToRussianDay(day)
    this.currentWeek.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    let result: string = this.currentWeek.get(date);
    if(result === undefined) {
      result = this.currentWeek.get(day)
    }
    return result;
  }

  printPlan(): void {
    console.log("this.currentWeek: " + this.currentWeek);
    const startWeek = this.currentWeek.get("ПОНЕДЕЛЬНИК");
    const endWeek = this.currentWeek.get("ВОСКРЕСЕНЬЕ");
    console.log("startWeek: " + startWeek);
    console.log("tendWeek: " + endWeek);
    this.planService.printPlanReal(this.selectedPlanId, startWeek, endWeek).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      saveAs(blob, 'plan.xlsx');
    });
  }

  checkPublish(): boolean {
    const currentPlan = this.plans.find(plan => plan.planId === this.selectedPlanId);
    return !currentPlan.ready;
  }
}
