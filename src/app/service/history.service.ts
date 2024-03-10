import{Injectable}from'@angular/core';
import {HttpClient}from '@angular/common/http';
import {Observable} from 'rxjs';
import {DayOfWeek} from '../models/DayOfWeek';
import {EatingTime}from '../models/EatingTime';

const HISTORY_API = 'http://localhost:8080/api/history/';

@Injectable({
providedIn: 'root'
})
export class HistoryService {

constructor(private http: HttpClient) { }

  last(planId: number, dayOfWeek: DayOfWeek, eatingTime: EatingTime, ingredientNew: string): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('ingredientNew', ingredientNew);
    return this.http.post(HISTORY_API + planId + '/' + dayOfWeek + '/' + eatingTime + '/last', uploadData);
  }
}
