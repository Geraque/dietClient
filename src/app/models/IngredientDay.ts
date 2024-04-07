import{Ingredient}from'../models/Ingredient';

export interface IngredientDay {
  id: number;
  ingredient: Ingredient;
  count: number;
  checkIngredient: boolean;
}
