import React, { useState } from 'react';
import { MealFoodItem } from './MealFoodItem';

interface MealCardProps {
  mealName: string;
  itemCount: number;
  totalCalories: number;
  items?: Array<{ id: number; foodName: string; quantity: number; calories: number }>;
  onAddClick: (mealName: string) => void;
}

export function MealCard({ mealName, itemCount, totalCalories, items = [], onAddClick }: MealCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-[#0B0B0B] border border-[#242424] rounded-lg overflow-hidden transition-all ${itemCount === 0 ? 'opacity-70' : ''}`}>
      <div 
        className="p-md flex justify-between items-center hover:bg-surface-container-low transition-colors cursor-pointer"
        onClick={() => {
          if (itemCount > 0) {
            setIsExpanded(!isExpanded);
          } else {
            onAddClick(mealName);
          }
        }}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-xs">
            <span className="font-headline-md text-on-surface">{mealName}</span>
            {itemCount > 0 && (
              <span className={`material-symbols-outlined text-on-surface-variant text-[20px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            )}
          </div>
          <span className="font-body-sm text-on-surface-variant">
            {itemCount === 0 ? 'Add meal' : `${itemCount} item${itemCount !== 1 ? 's' : ''}`}
          </span>
        </div>
        <div className="flex items-center gap-md">
          <span className={`font-headline-md ${itemCount === 0 ? 'text-on-surface-variant' : 'text-on-surface'}`}>
            {itemCount === 0 ? '-- kcal' : `${totalCalories.toLocaleString()} kcal`}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddClick(mealName);
            }}
            className="w-8 h-8 rounded-full border border-[#242424] text-on-surface hover:border-on-surface hover:bg-surface flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>
      </div>
      
      {isExpanded && items.length > 0 && (
        <div className="px-md pb-md flex flex-col bg-[#141414] border-t border-[#242424]">
          {items.map(item => (
            <MealFoodItem 
              key={item.id}
              id={item.id}
              foodName={item.foodName}
              quantity={item.quantity}
              calories={item.calories}
            />
          ))}
        </div>
      )}
    </div>
  );
}
