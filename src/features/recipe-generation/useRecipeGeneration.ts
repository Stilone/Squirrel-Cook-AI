import { useState, useEffect } from 'react';
import { Recipe } from '@/app/types';
import { openAIApi } from '@/shared/api/openai';
import { parseRecipeResponse } from '@/shared/lib/recipe-parser';
import { formatPrompt } from '@/shared/lib/utils';
import { RECIPE_PROMPT_TEMPLATE, LOADING_TEXTS } from '@/shared/config/constants';
import { getRandomText } from '@/shared/lib/utils';

export const useRecipeGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [parsedRecipe, setParsedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (isLoading) {
      // Сразу устанавливаем первый текст
      const initialText = getRandomText(LOADING_TEXTS);
      setDisplayText(initialText);
      
      // Затем меняем каждые 2 секунды
      const interval = setInterval(() => {
        const randomText = getRandomText(LOADING_TEXTS);
        setDisplayText(randomText);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const generateRecipe = async (selectedMeal: string, token: string) => {
    if (!token.trim()) {
      setError('Пожалуйста, введите ваш API ключ OpenAI');
      return null;
    }

    setIsLoading(true);
    setError('');
    setParsedRecipe(null);

    try {
      const prompt = formatPrompt(RECIPE_PROMPT_TEMPLATE, { mealType: selectedMeal });
      
      const response = await openAIApi.generateText(prompt, token);
      const recipeText = response.choices[0].message.content;
      
      const parsed = parseRecipeResponse(recipeText);
      setParsedRecipe(parsed);
      
      return parsed;
    } catch (error) {
      setError((error as Error).message);
      console.error('Ошибка при генерации рецепта:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    displayText,
    parsedRecipe,
    generateRecipe
  };
}; 