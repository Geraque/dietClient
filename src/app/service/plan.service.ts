import{Injectable}from'@angular/core';
import {HttpClient}from '@angular/common/http';
import {Observable} from 'rxjs';
import {DayOfWeek} from '../models/DayOfWeek';
import {EatingTime}from '../models/EatingTime';

const PLAN_API = 'http://localhost:8080/api/plan/';

@Injectable({
providedIn: 'root'
})
export class PlanService {

constructor(private http: HttpClient) { }
  getPlansForCurrentUser(): Observable<any> {
    return this.http.get(PLAN_API + 'all');
  }

  addIngredient(planId: number, dayOfWeek: DayOfWeek,
                        eatingTime: EatingTime, ingredient: string,
                        count: number): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('ingredient', ingredient);
    uploadData.append('count', count.toString()); // Перевести число в строку

    // Исправьте запрос на POST и отправьте uploadData
    return this.http.post(PLAN_API + planId + '/' + dayOfWeek + '/' + eatingTime + '/ingredient', uploadData);
  }

  addIngredientReal(planId: number, dayOfWeek: DayOfWeek,
                        eatingTime: EatingTime, ingredient: string,
                        count: number, date: string): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('ingredient', ingredient);
    uploadData.append('count', count.toString()); // Перевести число в строку
    uploadData.append('date', date);

    // Исправьте запрос на POST и отправьте uploadData
    return this.http.post(PLAN_API + planId + '/' + dayOfWeek + '/' + eatingTime + '/ingredient/real', uploadData);
  }

  check(planId: number, dayOfWeek: DayOfWeek,
                        eatingTime: EatingTime, ingredient: string,
                        count: number): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('ingredient', ingredient);
    uploadData.append('count', count.toString()); // Перевести число в строку

    // Исправьте запрос на POST и отправьте uploadData
    return this.http.post(PLAN_API + planId + '/' + dayOfWeek + '/' + eatingTime + '/check', uploadData);
  }

  checkReal(planId: number, dayOfWeek: DayOfWeek,
                        eatingTime: EatingTime, ingredient: string,
                        count: number, date: string): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('ingredient', ingredient);
    uploadData.append('count', count.toString()); // Перевести число в строку
    uploadData.append('date', date);

    // Исправьте запрос на POST и отправьте uploadData
    return this.http.post(PLAN_API + planId + '/' + dayOfWeek + '/' + eatingTime + '/check/real', uploadData);
  }

  update(planId: number, dayOfWeek: DayOfWeek,
                        eatingTime: EatingTime, ingredientOld: string,
                        ingredientNew: string, count: number, comment: string): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('ingredientOld', ingredientOld);
    uploadData.append('ingredientNew', ingredientNew);
    uploadData.append('count', count.toString()); // Перевести число в строку
    uploadData.append('comment', comment);

    // Исправьте запрос на POST и отправьте uploadData
    return this.http.post(PLAN_API + planId + '/' + dayOfWeek + '/' + eatingTime + '/update', uploadData);
  }

  updateReal(planId: number, dayOfWeek: DayOfWeek,
                        eatingTime: EatingTime, ingredientOld: string,
                        ingredientNew: string, count: number, comment: string, date: string): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('ingredientOld', ingredientOld);
    uploadData.append('ingredientNew', ingredientNew);
    uploadData.append('count', count.toString()); // Перевести число в строку
    uploadData.append('comment', comment);
    uploadData.append('date', date);

    // Исправьте запрос на POST и отправьте uploadData
    return this.http.post(PLAN_API + planId + '/' + dayOfWeek + '/' + eatingTime + '/update/real', uploadData);
  }

  getTodayForCurrentUser(): Observable<any> {
    return this.http.get(PLAN_API + 'today');
  }

  createPlan(name: string): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('name', name);
    return this.http.post(PLAN_API + 'create', uploadData);
  }

}
