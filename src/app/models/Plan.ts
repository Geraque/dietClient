import {Day} from '../models/Day';
export interface Plan {
  planId: number;
  name: string;
  days: Day[];
}
