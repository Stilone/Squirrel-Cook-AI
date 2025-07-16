import React from 'react';
import { MEAL_TYPES } from '@/shared/config/constants';
import './MealSelector.scss';

interface MealSelectorProps {
  selectedMeal: string;
  onMealSelect: (meal: string) => void;
}

export const MealSelector: React.FC<MealSelectorProps> = ({
  selectedMeal,
  onMealSelect
}) => {
  return (
    <div className="meal-selector">
      {MEAL_TYPES.map((meal) => (
        <div
          key={meal.id}
          className={`meal-option ${selectedMeal === meal.name ? 'active' : ''}`}
          onClick={() => onMealSelect(meal.name)}
        >
          {meal.label}
        </div>
      ))}
    </div>
  );
}; 