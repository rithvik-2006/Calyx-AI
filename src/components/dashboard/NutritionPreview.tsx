import React from 'react';
import { FoodDTO } from '@/types/food.types';

interface NutritionPreviewProps {
  food: FoodDTO | null;
  quantity: number;
}

export function NutritionPreview({ food, quantity }: NutritionPreviewProps) {
  if (!food) {
    return (
      <div className="w-full bg-[#0B0B0B] border border-[#242424] border-dashed rounded-lg p-lg flex items-center justify-center text-on-surface-variant font-body-sm mt-sm">
        Select a food to preview nutrition
      </div>
    );
  }

  const cals = Math.round(food.calories * quantity);
  const prot = (food.protein * quantity).toFixed(1);
  const fat = (food.fat * quantity).toFixed(1);
  const carbs = (food.carbs * quantity).toFixed(1);

  return (
    <div className="w-full bg-surface-container border border-surface-tint/20 rounded-lg p-md mt-sm flex flex-col gap-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-surface-tint"></div>
      
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="font-headline-sm text-on-surface">{food.name}</span>
          <span className="font-body-sm text-on-surface-variant">Serving: {food.servingSize}</span>
        </div>
        <span className="font-headline-md text-surface-tint">{cals} kcal</span>
      </div>
      
      <div className="grid grid-cols-3 gap-sm pt-sm border-t border-[#242424] mt-xs">
        <div className="flex flex-col">
          <span className="font-label-sm text-on-surface-variant uppercase">Protein</span>
          <span className="font-body-md text-on-surface font-semibold">{prot}g</span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-sm text-on-surface-variant uppercase">Fat</span>
          <span className="font-body-md text-on-surface font-semibold">{fat}g</span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-sm text-on-surface-variant uppercase">Carbs</span>
          <span className="font-body-md text-on-surface font-semibold">{carbs}g</span>
        </div>
      </div>
    </div>
  );
}
