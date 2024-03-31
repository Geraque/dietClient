import {Ingredient} from'../models/Ingredient';

export interface IngredientRealDay {
  id: number;
  ingredient: Ingredient;
  count: number;
  checkIngredient: boolean;
}
