export const MEAL_TYPES = [
  { id: 'any', name: 'любое блюдо', label: 'Любое блюдо' },
  { id: 'breakfast', name: 'Завтрак', label: 'Завтрак' },
  { id: 'lunch', name: 'Обед', label: 'Обед' },
  { id: 'dinner', name: 'Ужин', label: 'Ужин' },
  { id: 'dessert', name: 'Десерт', label: 'Десерт' }
] as const;

export const LOADING_TEXTS = [
  'Выбираем самое вкусное блюдо',
  'Советуемся у повара',
  'Листаем рецепты',
  'Советуемся с бабушками',
  'Сочиняем рецепт',
  'Спрашиваем совет у гурманов',
  'Плачем над кастрюлей',
  'Спрашиваем прохожих',
  'Отбираем рецепт у Илона Маска',
  'Ждём совета от мишленовского ресторана',
  'Листаем поваренную книгу',
  'Подбираем специи',
  'Спрашиваем у главного по тарелочкам'
] as const;

export const API_ENDPOINTS = {
  OPENAI_PROXY: '/api/openai-proxy'
} as const;

export const RECIPE_PROMPT_TEMPLATE = `Сгенерируй {mealType}, которое можно приготовить в домашних условиях. Ответ должен содержать:

1. Название блюда
2. Список ингредиентов с точными граммами
3. Общий вес готового блюда
4. Пищевую ценность (калории, белки, жиры, углеводы) на 100г
5. Пошаговый рецепт приготовления

Формат ответа:
Блюдо: [название]

Ингредиенты:
- [ингредиент 1]: [граммы]г
- [ингредиент 2]: [граммы]г
- и т.д.

Общий вес: [общий вес]г

Пищевая ценность (на 100г):
- Калории: [число] ккал
- Белки: [число]г
- Жиры: [число]г
- Углеводы: [число]г

Рецепт:
1. [шаг 1]
2. [шаг 2]
и т.д.

Без вводных данных и посторения моих слов.`;

export const IMAGE_PROMPT_TEMPLATE = `Ultra-realistic professional restaurant food photography of {dishName}. Ingredients: {ingredients}. Cooking: {cookingMethod}. Michelin-starred restaurant quality, perfect lighting, elegant plating, studio photography, high-resolution, appetizing, photorealistic.`; 