'use client';

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useFoodSearch } from '@/hooks/useFoodSearch';
import { useFoodSuggestions } from '@/hooks/useFoodSuggestions';
import { useAddFood } from '@/hooks/useLogs';
import { useCreateCustomFood } from '@/hooks/useFoods';
import { useToggleFavorite } from '@/hooks/useFavorites';
import { FoodDTO } from '@/types/food.types';

export default function SearchPage() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const { data: searchResults, isLoading: isSearching } = useFoodSearch(debouncedQuery);
  const { data: suggestions, isLoading: isLoadingSuggestions } = useFoodSuggestions();
  const addFoodMutation = useAddFood();
  const createCustomFoodMutation = useCreateCustomFood();
  const toggleFavoriteMutation = useToggleFavorite();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    protein: '',
    fat: '',
    carbs: '',
    servingSize: '1 serving'
  });
  const [addToFavorites, setAddToFavorites] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleAdd = (food: FoodDTO) => {
    const key = `${food.source}-${food.id}`;
    setAddedItems((prev) => ({ ...prev, [key]: true }));
    
    addFoodMutation.mutate({
      foodId: food.id,
      source: food.source,
      mealType: 'Snack', // Defaulting to snack from search, in a real app this might be selected by user
      quantity: 1
    });

    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [key]: false }));
    }, 1000);
  };

  const displayFoods = debouncedQuery.trim().length > 0 ? searchResults : suggestions;
  const isLoading = debouncedQuery.trim().length > 0 ? isSearching : isLoadingSuggestions;

  const handleCreateCustomFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFood.name || !customFood.calories) return;

    const res = await createCustomFoodMutation.mutateAsync({
      name: customFood.name,
      calories: parseInt(customFood.calories) || 0,
      protein: parseInt(customFood.protein) || 0,
      fat: parseInt(customFood.fat) || 0,
      carbs: parseInt(customFood.carbs) || 0,
      servingSize: customFood.servingSize
    });

    if (res && res.id && addToFavorites) {
      await toggleFavoriteMutation.mutateAsync({ foodId: res.id, source: 'custom_foods' });
    }

    setIsModalOpen(false);
    setCustomFood({
      name: '', calories: '', protein: '', fat: '', carbs: '', servingSize: '1 serving'
    });
    setAddToFavorites(false);
  };

  return (
    <main className="w-full max-w-[430px] px-lg pt-xl pb-xl flex flex-col gap-xl relative min-h-screen">
      {/* Search Header */}
      <section className="w-full flex flex-col gap-sm">
        <h1 className="font-headline-lg-mobile text-on-surface mb-sm">Log Food</h1>
        <div className="relative w-full">
          <span 
            className={twMerge(
              clsx(
                "material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 transition-colors",
                isFocused ? "text-on-surface" : "text-on-surface-variant"
              )
            )}
          >
            search
          </span>
          <input
            autoFocus
            type="text"
            placeholder="Search food..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full pl-xl pr-sm py-sm text-body-lg font-body-lg text-on-surface placeholder:text-on-surface-variant bg-surface-container rounded-lg border border-[#242424] focus:outline-none focus:border-on-surface transition-colors"
          />
        </div>
      </section>

      {/* Search Results */}
      <section className="w-full flex flex-col">
        <h2 className="font-label-caps text-on-surface-variant mb-md uppercase">
          {debouncedQuery.trim().length > 0 ? 'Search Results' : 'Recent & Suggestions'}
        </h2>
        
        {isLoading ? (
           <div className="flex justify-center py-xl">
             <div className="w-8 h-8 border-4 border-surface-tint border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : (
          <div className="flex flex-col bg-surface rounded-lg border border-[#242424] overflow-hidden">
            {displayFoods && displayFoods.length > 0 ? (
              displayFoods.map((food) => {
                const key = `${food.source}-${food.id}`;
                return (
                  <div 
                    key={key} 
                    className="flex items-center justify-between py-md px-md cursor-pointer group border-b border-[#242424] last:border-b-0 hover:bg-surface-container-low transition-colors"
                  >
                    <div className="flex flex-col gap-xs flex-1">
                      <span className="font-body-lg text-on-surface font-semibold">{food.name}</span>
                      <div className="flex gap-sm items-center">
                        <span className="font-body-sm text-on-surface-variant">{food.calories} kcal</span>
                        <span className="w-[3px] h-[3px] rounded-full bg-on-surface-variant"></span>
                        <span className="font-body-sm text-on-surface-variant">{food.protein}g Protein</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-md">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteMutation.mutate({ foodId: food.id, source: food.source });
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-surface-container text-on-surface-variant hover:text-primary"
                      >
                        <span 
                          className={twMerge(clsx("material-symbols-outlined text-[20px]", food.isFavorite && "text-primary"))}
                          style={food.isFavorite ? { fontVariationSettings: "'FILL' 1" } : {}}
                        >
                          {food.isFavorite ? 'favorite' : 'favorite_border'}
                        </span>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdd(food);
                        }}
                        disabled={addFoodMutation.isPending && addedItems[key]}
                        className={twMerge(
                          clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200",
                            addedItems[key] 
                              ? "bg-on-surface text-background border-on-surface"
                              : "bg-transparent text-on-surface-variant border-[#242424] hover:border-on-surface hover:text-on-surface"
                          )
                        )}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {addedItems[key] ? 'check' : 'add'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-xl text-center text-on-surface-variant font-body-lg">
                No foods found.
              </div>
            )}
          </div>
        )}
      </section>

      {/* FAB */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 md:absolute md:bottom-6 md:right-6 w-14 h-14 bg-on-surface text-background rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:bg-surface-tint hover:scale-105 active:scale-95 transition-all z-40"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {/* Custom Food Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-lg backdrop-blur-sm transition-opacity">
          <div className="bg-surface border border-[#242424] rounded-2xl w-full max-w-[360px] p-xl flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="font-headline-md text-on-surface">Create Custom Food</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateCustomFood} className="flex flex-col gap-md">
              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Food Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Mom's Lasagna"
                  value={customFood.name}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-md py-sm bg-[#0B0B0B] border border-[#242424] rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-on-surface transition-colors font-body-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Calories *</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    placeholder="kcal"
                    value={customFood.calories}
                    onChange={(e) => setCustomFood(prev => ({ ...prev, calories: e.target.value }))}
                    className="w-full px-md py-sm bg-[#0B0B0B] border border-[#242424] rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-on-surface transition-colors font-body-lg"
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Protein (g)</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="g"
                    value={customFood.protein}
                    onChange={(e) => setCustomFood(prev => ({ ...prev, protein: e.target.value }))}
                    className="w-full px-md py-sm bg-[#0B0B0B] border border-[#242424] rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-on-surface transition-colors font-body-lg"
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Fat (g)</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="g"
                    value={customFood.fat}
                    onChange={(e) => setCustomFood(prev => ({ ...prev, fat: e.target.value }))}
                    className="w-full px-md py-sm bg-[#0B0B0B] border border-[#242424] rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-on-surface transition-colors font-body-lg"
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Carbs (g)</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="g"
                    value={customFood.carbs}
                    onChange={(e) => setCustomFood(prev => ({ ...prev, carbs: e.target.value }))}
                    className="w-full px-md py-sm bg-[#0B0B0B] border border-[#242424] rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-on-surface transition-colors font-body-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-sm mt-xs">
                <input 
                  type="checkbox" 
                  id="addToFavorites"
                  checked={addToFavorites}
                  onChange={(e) => setAddToFavorites(e.target.checked)}
                  className="w-5 h-5 rounded border-[#242424] bg-[#0B0B0B] text-primary focus:ring-0 focus:ring-offset-0"
                />
                <label htmlFor="addToFavorites" className="font-body-sm text-on-surface cursor-pointer select-none">
                  Add to favorites
                </label>
              </div>
              
              <button 
                type="submit"
                disabled={createCustomFoodMutation.isPending}
                className="w-full mt-sm py-md bg-on-surface text-background rounded-lg font-headline-md font-semibold hover:bg-surface-tint transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createCustomFoodMutation.isPending ? 'Saving...' : 'Save Custom Food'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
