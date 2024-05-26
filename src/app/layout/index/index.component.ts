import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators}from '@angular/forms';
import { IngredientService } from '../../service/ingredient.service';
import { PlanService } from '../../service/plan.service';
import { UserService } from '../../service/user.service';
import { HistoryService } from '../../service/history.service';
import {Day} from '../../models/Day';
import {DayOfWeek} from '../../models/DayOfWeek';
import {EatingTime} from '../../models/EatingTime';
import {Plan} from '../../models/Plan';
import {User}from '../../models/User';
import {NotificationService}from '../../service/notification.service';

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
  users: User[];
  selectedPlanId: number;
  selectedUserId: number;
  isDietician: boolean = false;
  showPublishModal: boolean = false;
  showCopyModal: boolean = false;
  showCreateModal: boolean = false;
  showEditModal: boolean = false;
  copyPlanId: number;
  public publishForm: FormGroup;
  public createForm: FormGroup;
  public editForm: FormGroup;

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
    this.checkIfDietician();
    this.getIngredients();
    this.getPlans();
    this.getUsers();
    this.initializeAmounts();
    this.getIngredients();
  }
  //Метод для открытия модального окна копирования:
  openCopyModal(): void {
    this.showCopyModal = true;
  }

  // Метод для закрытия модального окна копирования:
  closeCopyModal(): void {
    this.showCopyModal = false;
  }

  createPublishForm(): FormGroup {
    return this.fb.group({
      userName: ['', Validators.compose([Validators.required])],
      week: ['', Validators.compose([Validators.required])],
      date: ['', Validators.compose([Validators.required])],
    });
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
    return new FormGroup({
      ingredient: new FormControl('', Validators.required),
      count: new FormControl(1, [Validators.required, Validators.min(0)]),
      comment: new FormControl('')
    });
  }

  updateIngredient() {
    if (this.editForm.valid) {
      const { ingredient, count, comment} = this.editForm.value;
      if (count > 0 && ingredient) {
        this.planService.update(this.selectedPlanId, this.editDay, this.editEatingTime, this.editIngredient.ingredient.name, ingredient, count, comment).subscribe(
          response => {
            this.notificationService.showSnackBar('Ингредиент изменён');
            console.log('Ингредиент обновлен:', response);
            // Здесь можно обновить UI соответствующим образом
            this.updateIngredientsForDayAndMeal(this.editDay, this.editEatingTime);
          },
          error => {
            console.error('Ошибка при обновлении ингредиента:', error);
          }
        );
      } else {
          console.error('Ингредиент не выбран или количество указано не верно.');
      }
    }
  }

  //Метод для открытия модального окна копирования:
  openCreateModal(): void {
    this.showCreateModal = true;
    this.createForm = this.createCreateForm();
  }

  // Метод для закрытия модального окна копирования:
  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  createCreateForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.compose([Validators.required])],
    });
  }

  // Добавляем функцию для создания нового плана
  createPlan() {
    if (this.createForm.valid) {
      const { name} = this.createForm.value;
      this.planService.createPlan(name).subscribe({
        next: (plan) => {
          this.notificationService.showSnackBar('План создан');
          console.log('План создан:', plan);
          this.getPlans(); // Обновляем список планов
          this.selectedPlanId = plan.planId; // Устанавливаем созданный план как выбранный
        },
        error: (error) => {
          console.error('Ошибка при создании плана:', error);
        }
      });
    }


  }

  //Метод копирования плана:
  copyPlan(): void {
    if (!this.copyPlanId) {
      alert("Выберите план для копирования.");
      return;
    }
    this.planService.copy(this.selectedPlanId.toString(), this.copyPlanId.toString()).subscribe({
      next: (response) => {
        this.notificationService.showSnackBar('План успешно скопирован');
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
    this.publishForm = this.createPublishForm();
  }

  // Метод для закрытия модального окна
  closeModal(): void {
    this.showPublishModal = false;
  }

  publishPlan(): void {
    if (this.publishForm.valid) {
      const { userName, week, date} = this.publishForm.value;
      this.planService.ready(this.selectedPlanId, userName, week, date).subscribe({
        next: (response) => {
          this.notificationService.showSnackBar('План опубликован');
          console.log('План успешно опубликован:', response);
          this.closeModal();
        },
        error: (error) => {
          this.notificationService.showSnackBar('Введите валидные данные');
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

  getPlans(selectedPlanId?: number) {
    this.planService.getPlansForCurrentUser().subscribe(
      plansData => {
        this.plans = plansData;
        // Устанавливаем selectedPlanId на переданное значение или по умолчанию первый план
        if (this.plans && this.plans.length > 0) {
          this.selectedPlanId = selectedPlanId ? selectedPlanId : this.plans[0].planId;
        } else {
          this.selectedPlanId = null;
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      usersData => {
        this.users = usersData;
        if (this.users && this.users.length > 0) {
          this.selectedUserId = this.users[0].userId;
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
          this.notificationService.showSnackBar('Ингредиент добавлен');
          console.log('Ингредиент добавлен:', response);
          const currentSelectedPlanId = this.selectedPlanId;
          // Обновляем UI и сохраняем план
          this.updateIngredientsAfterAdd(day, meal, currentSelectedPlanId);
        },
        error => {
          console.error('Ошибка при добавлении ингредиента:', error);
        }
      );
    } else {
      console.error('Ингредиент не выбран или количество указано не верно.');
    }
  }

  deleteIngredient(planId: number, day: DayOfWeek, meal: EatingTime, ingredient: any) {
    if (ingredient) {
      this.planService.deleteIngredient(planId, day, meal, ingredient).subscribe(
        response => {
          this.notificationService.showSnackBar('Ингредиент удалён');
          console.log('Ингредиент удалён:', response);
          // Тут можно добавить логику обновления UI
          this.updateIngredientsForDayAndMeal(day, meal);
        },
        error => {
          console.error('Ошибка при удалении ингредиента:', error);
        }
      );
    } else {
      console.error('Ингредиент не выбран');
    }
  }


  check(planId: number, day: DayOfWeek, meal: EatingTime, ingredient: any, count: number) {
      this.planService.check(planId, day, meal, ingredient, count).subscribe(
        response => {
          console.log('Ингредиент check:', response);
          this.notificationService.showSnackBar('Ингредиент подтверждён');
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

  updateIngredientsAfterAdd(day: DayOfWeek, meal: EatingTime, planId: number) {
      this.getPlans(planId);
  }

  updateIngredientsForDayAndMeal(day: DayOfWeek, meal: EatingTime) {
    this.getPlans();
  }

  enableEdit(ingredientDay: any) {
      ingredientDay.editing = true;
      // Здесь также можно проинициализировать селектор со значением ингредиента, если нужно.
      ingredientDay.selectedIngredient = ingredientDay.ingredient;
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

  checkPublish(): boolean {
    const currentPlan = this.plans.find(plan => plan.planId === this.selectedPlanId);
    return !currentPlan.ready;
  }
}
