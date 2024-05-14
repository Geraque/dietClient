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

  create(calories: number, carbohydrates: number,
                        fat: number, name: string,
                        proteins: number): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('calories', calories.toString());
    uploadData.append('carbohydrates', carbohydrates.toString());
    uploadData.append('fat', fat.toString());
    uploadData.append('name', name);
    uploadData.append('proteins', proteins.toString());

    // Исправьте запрос на POST и отправьте uploadData
    return this.http.post(INGREDIENT_API + 'create', uploadData);
  }

  change(calories: number, carbohydrates: number,
                        fat: number, name: string,
                        proteins: number): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('calories', calories.toString());
    uploadData.append('carbohydrates', carbohydrates.toString());
    uploadData.append('fat', fat.toString());
    uploadData.append('name', name);
    uploadData.append('proteins', proteins.toString());

    // Исправьте запрос на POST и отправьте uploadData
    return this.http.post(INGREDIENT_API + 'change', uploadData);
  }

  delete(name: string): Observable<any> {
    return this.http.delete(INGREDIENT_API + name + '/delete');
  }
}
