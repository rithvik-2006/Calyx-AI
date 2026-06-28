


import React, { useState, useEffect } from 'react';
import { MealSelector } from './MealSelector';
import { FoodSearchInput } from './FoodSearchInput';
import { QuantityInput } from './QuantityInput';
import { NutritionPreview } from './NutritionPreview';
import { useAddFood } from '@/hooks/useLogs';
import { FoodDTO } from '@/types/food.types';
import { FavoriteFoodDTO } from '@/types/favorite.types';

interface FoodLogSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialMeal: string;
  initialFood?: FoodDTO | FavoriteFoodDTO | null;
}

export function FoodLogSheet({ isOpen, onClose, initialMeal, initialFood }: FoodLogSheetProps) {
  const [meal, setMeal] = useState(initialMeal || 'Breakfast');
  const [selectedFood, setSelectedFood] = useState<FoodDTO | FavoriteFoodDTO | null>(initialFood || null);
  const [quantity, setQuantity] = useState(1);

  const addFoodMutation = useAddFood();

  // Reset state when opening with a new initial meal or food
  useEffect(() => {
    if (isOpen) {
      setMeal(initialMeal || 'Breakfast');
      setSelectedFood(initialFood || null);
      setQuantity(1);
    }
  }, [isOpen, initialMeal, initialFood]);

  const handleSave = async () => {
    if (!selectedFood) return;

    const foodId = 'foodId' in selectedFood ? selectedFood.foodId : selectedFood.id;

    await addFoodMutation.mutateAsync({
      mealType: meal as 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner',
      foodId: foodId,
      source: selectedFood.source,
      quantity: quantity
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    // Added pb-24 to ensure the sheet stays above your persistent bottom navigation bar on mobile devices
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center px-0 sm:px-lg pb-24 sm:pb-0">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Changed fixed h-[90vh] to h-auto with a clean max-h-[80vh] container constraint */}
      <div className="relative w-full max-w-[420px] h-auto max-h-[80vh] bg-[#121212] border border-[#242424] sm:rounded-2xl rounded-t-3xl p-6 flex flex-col shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300">
        
        {/* Top sheet handle wrapper for mobile */}
        <div className="w-12 h-1.5 bg-[#242424] rounded-full mx-auto sm:hidden absolute top-3 left-1/2 -translate-x-1/2"></div>
        
        {/* Title bar spacing */}
        <div className="flex justify-between items-center mt-3 sm:mt-0 mb-4">
          <h3 className="text-xl font-bold text-white">Log Food</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1c1c1e] text-gray-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form elements container */}
        <div className="overflow-y-auto flex flex-col gap-5 pr-1 pb-4">
          <MealSelector value={meal} onChange={setMeal} />
          
          <FoodSearchInput 
            selectedFood={selectedFood}
            onSelect={setSelectedFood}
          />
          
          <QuantityInput 
            value={quantity}
            onChange={setQuantity}
          />
          
          <NutritionPreview 
            food={selectedFood as any}
            quantity={quantity}
          />
        </div>

        {/* Action Button Section with visible top border accent */}
        <div className="border-t border-[#242424] pt-4 mt-2">
          <button 
            onClick={handleSave}
            disabled={!selectedFood || addFoodMutation.isPending}
            className="w-full py-3.5 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {addFoodMutation.isPending && (
               <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            )}
            {addFoodMutation.isPending ? 'Saving...' : 'Save Food'}
          </button>
        </div>
      </div>
    </div>
  );
}