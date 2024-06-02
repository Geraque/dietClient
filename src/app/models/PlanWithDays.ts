import {Day} from '../models/Day';

export interface PlanWithDays {
  planId: number;
  name: string;
  days: Day[];
}
