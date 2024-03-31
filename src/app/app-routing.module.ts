import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {IndexComponent} from './layout/index/index.component';
import {CalendarComponent} from './layout/calendar/calendar.component';
import {DayComponent} from './layout/day/day.component';
import {RealDayComponent} from './layout/real-day/real-day.component';
import {AuthGuardService} from './helper/auth-guard.service';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'main', component: IndexComponent, canActivate: [AuthGuardService]},
  {path: 'profile', component: CalendarComponent, canActivate: [AuthGuardService]},
  {path: 'day', component: DayComponent, canActivate: [AuthGuardService]},
  {path: 'real-day', component: RealDayComponent, canActivate: [AuthGuardService]},
  {path: '', redirectTo: 'main', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
