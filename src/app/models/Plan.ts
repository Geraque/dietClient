import {Day} from '../models/Day';
import {RealDay} from '../models/RealDay';

export interface Plan {
  planId: number;
  name: string;
  days: Day[];
  realDays: RealDay[];
  ready: boolean;
}
