export interface Recipe {
  dishName: string;
  ingredients: string[];
  totalWeight: string;
  nutrition: {
    calories: string;
    proteins: string;
    fats: string;
    carbs: string;
  };
  recipe: string[];
}

export interface MealType {
  id: string;
  name: string;
  label: string;
}

export interface ApiResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface ImageApiResponse {
  data: Array<{
    url: string;
  }>;
}

export interface OpenAIRequest {
  prompt: string;
  apiKey: string;
  type: 'text' | 'image';
} 