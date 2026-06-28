import React, { useState, useEffect } from 'react';
import { useFoodSearch } from '@/hooks/useFoodSearch';
import { useToggleFavorite } from '@/hooks/useFavorites';
import { FoodDTO } from '@/types/food.types';
import { FavoriteFoodDTO } from '@/types/favorite.types';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

interface FoodSearchInputProps {
  onSelect: (food: FoodDTO | null) => void;
  selectedFood: FoodDTO | FavoriteFoodDTO | null;
}

export function FoodSearchInput({ onSelect, selectedFood }: FoodSearchInputProps) {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const toggleFavoriteMutation = useToggleFavorite();

  // If a food is selected, show its name in the input
  useEffect(() => {
    if (selectedFood) {
      setSearchInput(selectedFood.name);
    }
  }, [selectedFood]);

  const { data: searchResults, isLoading } = useFoodSearch(debouncedQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Only search if the input doesn't exactly match the already selected food
      if (!selectedFood || searchInput !== selectedFood.name) {
        setDebouncedQuery(searchInput);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, selectedFood]);

  const handleSelect = (food: FoodDTO) => {
    onSelect(food);
    setSearchInput(food.name);
    setIsFocused(false);
  };

  const showResults = isFocused && debouncedQuery.trim().length > 0 && searchResults;

  return (
    <div className="flex flex-col gap-xs relative">
      <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Food</label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        <input 
          type="text"
          placeholder="Search for food..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            if (selectedFood) onSelect(null as any); // Clear selection if they start typing again
          }}
          onFocus={() => setIsFocused(true)}
          // Delay blur to allow click on results
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full pl-xl pr-sm h-12 bg-[#0B0B0B] border border-[#242424] rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-on-surface transition-colors font-body-lg"
        />
      </div>

      {showResults && (
        <div className="absolute top-[72px] left-0 right-0 z-50 bg-[#141414] border border-[#242424] rounded-lg shadow-2xl max-h-[250px] overflow-y-auto overflow-x-hidden flex flex-col">
          {isLoading ? (
            <div className="p-md text-center text-on-surface-variant">Searching...</div>
          ) : searchResults.length > 0 ? (
            searchResults.map(food => (
              <div 
                key={`${food.source}-${food.id}`}
                onClick={() => handleSelect(food)}
                className="flex justify-between items-center p-md hover:bg-surface-container-low cursor-pointer border-b border-[#242424] last:border-0"
              >
                <div className="flex flex-col flex-1">
                  <span className="font-body-md text-on-surface">{food.name}</span>
                  <span className="font-body-sm text-on-surface-variant">{food.servingSize}</span>
                </div>
                
                <div className="flex items-center gap-md">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteMutation.mutate({ foodId: food.id, source: food.source });
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-surface-container text-on-surface-variant hover:text-primary"
                  >
                    <span 
                      className={twMerge(clsx("material-symbols-outlined text-[18px]", food.isFavorite && "text-primary"))}
                      style={food.isFavorite ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {food.isFavorite ? 'favorite' : 'favorite_border'}
                    </span>
                  </div>
                  <span className="font-body-md text-on-surface-variant">{food.calories} kcal</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-md text-center text-on-surface-variant">No foods found.</div>
          )}
        </div>
      )}
    </div>
  );
}
