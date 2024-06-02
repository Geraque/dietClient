import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../../service/ingredient.service';
import { PlanService } from '../../service/plan.service';
import {Day} from '../../models/Day';
import {PlanWithDays} from '../../models/PlanWithDays';
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
  plans: PlanWithDays[];
  selectedPlanId: number;

constructor(private planService: PlanService) {}

  ngOnInit() {
    this.loadDays();
  }

  loadDays() {
    this.planService.getTodayForCurrentUser().subscribe(days => {
      this.plans = days;
      if (this.plans && this.plans.length > 0) {
        this.selectedPlanId = this.plans[0].planId;
        console.log("this.plans " + this.plans[0].planId)
      } else {
        this.selectedPlanId = null;
      }
      this.loadInfo();
    });
  }


  loadInfo() {
    if (this.selectedPlanId) {
     // Сбросить суммарные значения перед пересчетом
     this.totalProteins = 0;
     this.totalFats = 0;
     this.totalCarbohydrates = 0;
     this.totalCalories = 0;

     const todayMeals = this.plans.find(plan => plan.planId === this.selectedPlanId);

     if (todayMeals && todayMeals.days) {
       todayMeals.days.forEach(meal => {
         meal.ingredients.forEach(ingredient => {
           this.totalProteins += ingredient.ingredient.proteins * ingredient.count;
           this.totalFats += ingredient.ingredient.fat * ingredient.count;
           this.totalCarbohydrates += ingredient.ingredient.carbohydrates * ingredient.count;
           this.totalCalories += ingredient.ingredient.calories * ingredient.count;
         });
       });
       this.mealsToday = todayMeals.days;
     } else {
       this.mealsToday = [];
     }
   }
  }

  onPlanChange() {
   this.loadInfo();
  }


  translateEnglishToRussianEatingTime(englishDay: string): string {
    const daysMapping: { [key: string]: string } = {
      'BREAKFAST': 'ЗАВТРАК',
      'LUNCH': 'ОБЕД',
      'DINNER': 'УЖИН'
    };
    return daysMapping[englishDay] || '';
  }

  translateEnglishToRussianDate(currentDate: Date): string {
    const monthNames: { [key: string]: string } = {
        'January': 'Январь',
        'February': 'Февраль',
        'March': 'Март',
        'April': 'Апрель',
        'May': 'Май',
        'June': 'Июнь',
        'July': 'Июль',
        'August': 'Август',
        'September': 'Сентябрь',
        'October': 'Октябрь',
        'November': 'Ноябрь',
        'December': 'Декабрь'
    };

    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('en-US', { month: 'long' });
    const year = currentDate.getFullYear();

    const russianMonth = monthNames[month];

    return `${russianMonth} ${day}, ${year}`;
  }
}
