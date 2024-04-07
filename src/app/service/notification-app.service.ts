import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const NOTIFICATION_API = 'http://localhost:8080/api/notification/';

@Injectable({
providedIn: 'root'
})
export class NotificationAppService {

  constructor(private http: HttpClient) { }

  getAllByUser(): Observable<any> {
    return this.http.get(NOTIFICATION_API + 'user');
  }

  read(id: number): Observable<any> {
    console.log(NOTIFICATION_API + id)
    return this.http.post(NOTIFICATION_API + id, null);
  }
}
