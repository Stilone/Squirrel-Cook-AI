import React from 'react';
import { RecipeForm } from '@/widgets/recipe-form';
import { AnimatedBackground, SocialLinks } from '@/shared/ui';
import styles from './HomePage.module.scss';

export const HomePage: React.FC = () => {
  const handleGenerate = (response: string) => {
    console.log(response);
  };

  return (
    <div className={styles.homePage}>
      <AnimatedBackground />
      <SocialLinks />
      <div className={styles.content}>
        <RecipeForm onGenerate={handleGenerate} />
      </div>
    </div>
  );
}; 