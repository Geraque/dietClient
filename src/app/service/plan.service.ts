import{Injectable}from'@angular/core';
import {HttpClient}from '@angular/common/http';
import {Observable} from 'rxjs';

const PLAN_API = 'http://localhost:8080/api/plan/';

@Injectable({
providedIn: 'root'
})
export class PlanService {

constructor(private http: HttpClient) { }
  getPlansForCurrentUser(): Observable<any> {
    return this.http.get(PLAN_API + 'all');
  }
}
