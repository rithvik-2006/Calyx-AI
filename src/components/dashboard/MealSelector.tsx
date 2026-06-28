import React from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

interface MealSelectorProps {
  value: string;
  onChange: (meal: string) => void;
}

const MEALS = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

export function MealSelector({ value, onChange }: MealSelectorProps) {
  return (
    <div className="flex flex-col gap-xs">
      <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Meal</label>
      <div className="grid grid-cols-4 gap-sm bg-[#0B0B0B] p-1 rounded-lg border border-[#242424]">
        {MEALS.map(meal => (
          <button
            key={meal}
            type="button"
            onClick={() => onChange(meal)}
            className={twMerge(
              clsx(
                "py-1.5 rounded-md font-body-sm transition-colors",
                value === meal
                  ? "bg-on-surface text-background font-semibold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              )
            )}
          >
            {meal}
          </button>
        ))}
      </div>
    </div>
  );
}
