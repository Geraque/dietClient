import{Injectable}from'@angular/core';
import {HttpClient}from '@angular/common/http';
import {Observable} from 'rxjs';

const INGREDIENT_API = 'http://localhost:8080/api/ingredient/';

@Injectable({
providedIn: 'root'
})
export class IngredientService {

  constructor(private http: HttpClient) { }

  getAllRecipes(): Observable<any> {
    return this.http.get(INGREDIENT_API);
  }

  getIngredientById(id: number): Observable<any> {
    return this.http.get(INGREDIENT_API + id);
  }
}
