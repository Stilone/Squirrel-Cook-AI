import { useState, useEffect } from 'react';
import { openAIApi } from '@/shared/api/openai';
import { formatPrompt } from '@/shared/lib/utils';
import { IMAGE_PROMPT_TEMPLATE } from '@/shared/config/constants';
import { Recipe } from '@/app/types';

export const useImageGeneration = () => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [loadingDots, setLoadingDots] = useState('');
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (isGeneratingImage) {
      const interval = setInterval(() => {
        setLoadingDots(prev => {
          if (prev === '...') return '';
          if (prev === '..') return '...';
          if (prev === '.') return '..';
          return '.';
        });
      }, 500);

      return () => clearInterval(interval);
    } else if (!generatedImage) {
      // Показываем точки даже когда не генерируем, но изображения еще нет
      const interval = setInterval(() => {
        setLoadingDots(prev => {
          if (prev === '...') return '';
          if (prev === '..') return '...';
          if (prev === '.') return '..';
          return '.';
        });
      }, 800); // Немного медленнее для placeholder

      return () => clearInterval(interval);
    } else {
      setLoadingDots('');
    }
  }, [isGeneratingImage, generatedImage]);

  const generateImage = async (recipe: Recipe, token: string) => {
    setIsGeneratingImage(true);
    setImageError('');
    try {
      // Подготавливаем данные для промпта (ограничиваем длину для DALL-E API)
      const ingredients = recipe.ingredients.slice(0, 5).join(', ');
      const cookingMethod = recipe.recipe.slice(0, 2).join('; ');
      
      const imagePrompt = formatPrompt(IMAGE_PROMPT_TEMPLATE, { 
        dishName: recipe.dishName,
        ingredients: ingredients,
        cookingMethod: cookingMethod
      });
      
      const response = await openAIApi.generateImage(imagePrompt, token);
      
      if (response.data && response.data[0] && response.data[0].url) {
        setGeneratedImage(response.data[0].url);
        setImageError('');
        return response.data[0].url;
      } else {
        setGeneratedImage('');
        const errorMessage = 'Не удалось сгенерировать изображение. Попробуйте еще раз.';
        setImageError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Ошибка при генерации изображения:', error);
      setGeneratedImage('');
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при генерации изображения';
      setImageError(errorMessage);
      throw error;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return {
    isGeneratingImage,
    generatedImage,
    loadingDots,
    imageError,
    generateImage
  };
}; 