import React, { useState } from 'react';
import { Input, Button } from '@/shared/ui';
import { MealSelector } from '@/features/meal-selection';
import { useRecipeGeneration } from '@/features/recipe-generation';
import { useImageGeneration } from '@/features/image-generation';
import squirrel from '@/shared/assets/squirrel.png';
import './RecipeForm.scss';

interface RecipeFormProps {
  onGenerate: (response: string) => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ onGenerate }) => {
  const [token, setToken] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('любое блюдо');

  const { isLoading, error, displayText, parsedRecipe, generateRecipe } = useRecipeGeneration();
  const { isGeneratingImage, generatedImage, loadingDots, imageError, generateImage } = useImageGeneration();

  const handleGenerate = async () => {
    const recipe = await generateRecipe(selectedMeal, token);
    if (recipe) {
      onGenerate(JSON.stringify(recipe));
      
      // Генерируем изображение после успешного получения рецепта
      try {
        await generateImage(recipe, token);
      } catch (imageError) {
        console.error('Ошибка при генерации изображения:', imageError);
      }
    }
  };

  return (
    <div className="recipe-form">
      <header>
        <div className="header-content">
          <img src={squirrel} alt="Squirrel" className="image_title" />
          <h1>Squirrel cook</h1>
        </div>
        <p className="description">
          Умный помощник для кулинарного вдохновения
          <br />• Не знаете, что приготовить на ужин?
          <br />• Хотите попробовать что-то новое и вкусное?
          <br />• Нужен простой рецепт из доступных ингредиентов?
        </p>
      </header>

      <div className="card">
        <div className="form-group">
          <Input
            type="password"
            value={token}
            onChange={setToken}
            placeholder="sk-proj-..."
            label="API ключ OpenAI:"
          />
        </div>

        <div className="form-group">
          <label>Выберите блюдо:</label>
          <MealSelector
            selectedMeal={selectedMeal}
            onMealSelect={setSelectedMeal}
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          loading={isLoading}
          className="generate-btn"
        >
          {isLoading ? displayText : `Получить ${selectedMeal}`}
        </Button>

        {error && <div className="error-message">Ошибка: {error}</div>}
      </div>

      {parsedRecipe && !error && (
        <>
          {/* Основной блок с рецептом */}
          <div className="recipe-main-container">
            {/* Заголовок блюда */}
            <div className="recipe-header">
              <h2 className="dish-title">{parsedRecipe.dishName}</h2>
              <div className="dish-weight-badge">
                <span className="weight-label">Общий вес:</span>
                <span className="weight-value">{parsedRecipe.totalWeight}</span>
              </div>
            </div>
            
            {/* Ингредиенты */}
            <div className="ingredients-section">
              <h3>Ингредиенты</h3>
              <div className="ingredients-list">
                {parsedRecipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-item">
                    <span className="ingredient-name">{ingredient}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Рецепт приготовления */}
            <div className="recipe-section">
              <h3>Рецепт приготовления</h3>
              <div className="recipe-steps">
                {parsedRecipe.recipe.map((step, index) => (
                  <div key={index} className="recipe-step">
                    <span className="step-number">{index + 1}</span>
                    <span className="step-text">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Пищевая ценность */}
            <div className="nutrition-section">
              <h3>Пищевая ценность (на 100г)</h3>
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <span className="nutrition-label">Калории</span>
                  <span className="nutrition-value">{parsedRecipe.nutrition.calories}</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Белки</span>
                  <span className="nutrition-value">{parsedRecipe.nutrition.proteins}</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Жиры</span>
                  <span className="nutrition-value">{parsedRecipe.nutrition.fats}</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Углеводы</span>
                  <span className="nutrition-value">{parsedRecipe.nutrition.carbs}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Блок с изображением и действиями */}
          <div className="image-actions-container">
            <div className="image-section">
              {isGeneratingImage ? (
                <div className="image-loading">
                </div>
              ) : imageError ? (
                <div className="image-error">
                  <div className="image-error-icon">⚠️</div>
                  <div className="image-error-text">{imageError}</div>
                </div>
              ) : generatedImage ? (
                <img src={generatedImage} alt="Сгенерированное блюдо" className="generated-image" />
              ) : (
                <div className="image-placeholder">
                  Изображение появится здесь{loadingDots}
                </div>
              )}
            </div>
            
            <div className="actions-section">
              <div className="action-item">
                <div className="action-icon">💾</div>
                <span className="action-text">Сохранить рецепт</span>
              </div>
              <div className="action-item">
                <div className="action-icon">📤</div>
                <span className="action-text">Поделиться</span>
              </div>
              <div className="action-item">
                <div className="action-icon">⭐</div>
                <span className="action-text">Добавить в избранное</span>
              </div>
              <div className="action-item">
                <div className="action-icon">🖨️</div>
                <span className="action-text">Распечатать</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 