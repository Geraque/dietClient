import {IngredientDay} from '../models/IngredientDay';

export interface Day {
  dayId: number;
day: string; // Обязательно обновите DayOfWeek, чтобы это было перечисление.
eatingTime: string; // То же и для EatingTime.
ingredients: IngredientDay[];
}
