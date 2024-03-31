import {IngredientRealDay} from '../models/IngredientRealDay';

export interface RealDay {
  dayId: number;
  day: string;
  eatingTime: string;
  ingredients: IngredientRealDay[];
  date: Date;
}
