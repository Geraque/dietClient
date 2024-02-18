import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const USER_API = 'http://localhost:8080/api/user/';

@Injectable({
providedIn: 'root'
})
export class UserService {

constructor(private http: HttpClient) { }

  getUserById(id: number): Observable<any> {
    return this.http.get(USER_API + id);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(USER_API);
  }

  updateUser(user: any): Observable<any> {
    return this.http.post(USER_API + 'update', user);
  }

  updateUserByAdmin(user: any): Observable<any> {
    return this.http.post(USER_API + 'updateByAdmin', user);
  }

  getUserByUsername(username: string):Observable<any> {
    return this.http.post(USER_API +'get/'+ username,null);
  }

  isAdmin(userId: number):Observable<any> {
    return this.http.post(USER_API +'isAdmin/'+ userId,null);
  }
}
