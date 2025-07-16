import { Recipe } from '@/app/types';

export const parseRecipeResponse = (text: string): Recipe => {
  const lines = text.split('\n');
  let dishName = '';
  const ingredients: string[] = [];
  let totalWeight = '';
  const nutrition = { calories: '', proteins: '', fats: '', carbs: '' };
  const recipe: string[] = [];
  
  let currentSection = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('Блюдо:')) {
      dishName = trimmedLine.replace('Блюдо:', '').trim();
    } else if (trimmedLine === 'Ингредиенты:') {
      currentSection = 'ingredients';
    } else if (trimmedLine.startsWith('Общий вес:')) {
      totalWeight = trimmedLine.replace('Общий вес:', '').trim();
    } else if (trimmedLine === 'Пищевая ценность (на 100г):') {
      currentSection = 'nutrition';
    } else if (trimmedLine === 'Рецепт:') {
      currentSection = 'recipe';
    } else if (trimmedLine.startsWith('-') && currentSection === 'ingredients') {
      ingredients.push(trimmedLine.substring(1).trim());
    } else if (trimmedLine.startsWith('-') && currentSection === 'nutrition') {
      if (trimmedLine.includes('Калории:')) {
        nutrition.calories = trimmedLine.split(':')[1].trim();
      } else if (trimmedLine.includes('Белки:')) {
        nutrition.proteins = trimmedLine.split(':')[1].trim();
      } else if (trimmedLine.includes('Жиры:')) {
        nutrition.fats = trimmedLine.split(':')[1].trim();
      } else if (trimmedLine.includes('Углеводы:')) {
        nutrition.carbs = trimmedLine.split(':')[1].trim();
      }
    } else if (trimmedLine.match(/^\d+\./) && currentSection === 'recipe') {
      recipe.push(trimmedLine.replace(/^\d+\.\s*/, ''));
    }
  }
  
  return { dishName, ingredients, totalWeight, nutrition, recipe };
}; 