import React, { useState } from 'react';
import { useDeleteFood, useUpdateFood } from '@/hooks/useLogs';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

interface MealFoodItemProps {
  id: number;
  foodName: string;
  quantity: number;
  calories: number;
}

export function MealFoodItem({ id, foodName, quantity, calories }: MealFoodItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editQuantity, setEditQuantity] = useState(quantity);
  
  const deleteMutation = useDeleteFood();
  const updateMutation = useUpdateFood();

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editQuantity > 0 && editQuantity !== quantity) {
      updateMutation.mutate({ id, quantity: editQuantity }, {
        onSuccess: () => setIsEditing(false)
      });
    } else {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center justify-between py-sm border-b border-[#242424] last:border-0 pl-sm">
        <div className="flex flex-col flex-1 mr-md">
          <span className="font-body-md text-on-surface truncate">{foodName}</span>
          <div className="flex items-center gap-sm mt-1">
            <input 
              type="number" 
              min="0.1" 
              step="0.1" 
              value={editQuantity}
              onChange={(e) => setEditQuantity(Number(e.target.value))}
              onClick={(e) => e.stopPropagation()}
              className="w-16 px-sm py-1 bg-surface border border-[#242424] rounded text-on-surface text-center focus:outline-none focus:border-on-surface"
            />
            <span className="font-body-sm text-on-surface-variant">serving{editQuantity !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsEditing(false); setEditQuantity(quantity); }}
            className="text-on-surface-variant hover:text-on-surface transition-colors p-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <button 
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="text-primary hover:text-primary/80 transition-colors p-1"
          >
            <span className={twMerge(clsx("material-symbols-outlined text-[20px]", updateMutation.isPending && "animate-pulse"))}>
              check
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-sm border-b border-[#242424] last:border-0 pl-sm">
      <div className="flex flex-col flex-1 pr-sm">
        <span className="font-body-md text-on-surface line-clamp-1">{foodName}</span>
        <span className="font-body-sm text-on-surface-variant">{quantity} serving{quantity !== 1 ? 's' : ''}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-body-md text-on-surface whitespace-nowrap">{calories} kcal</span>
        <div className="flex items-center">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            className="text-on-surface-variant hover:text-on-surface transition-colors p-1"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(id); }}
            disabled={deleteMutation.isPending}
            className="text-on-surface-variant hover:text-error transition-colors p-1"
          >
            <span className={twMerge(clsx("material-symbols-outlined text-[18px]", deleteMutation.isPending && "animate-pulse"))}>
              delete
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
