'use client';

import { useState } from 'react';
import { useFavorites, useRecentFoods, usePinFavorite, useToggleFavorite } from '@/hooks/useFavorites';
import { FoodLogSheet } from '@/components/dashboard/FoodLogSheet';
import { FavoriteFoodDTO } from '@/types/favorite.types';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export default function FavoritesPage() {
  const { data: favoritesRes, isLoading: isLoadingFavs } = useFavorites();
  const { data: recentsRes, isLoading: isLoadingRecents } = useRecentFoods();
  
  const pinMutation = usePinFavorite();
  const toggleMutation = useToggleFavorite();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FavoriteFoodDTO | null>(null);

  const pinned = favoritesRes?.pinned || [];
  const others = favoritesRes?.others || [];
  const recents = recentsRes || [];

  const handleAddClick = (food: FavoriteFoodDTO) => {
    setSelectedFood(food);
    setIsSheetOpen(true);
  };

  const handleTogglePin = (e: React.MouseEvent, favId: number, currentPinnedStatus: boolean) => {
    e.stopPropagation();
    pinMutation.mutate({ favoriteId: favId, isPinned: !currentPinnedStatus });
  };

  const handleToggleFavorite = (e: React.MouseEvent, foodId: number, source: 'food_master' | 'custom_foods') => {
    e.stopPropagation();
    toggleMutation.mutate({ foodId, source });
  };

  return (
    <main className="w-full max-w-[720px] mx-auto px-lg md:px-lg pt-xl pb-32 flex-grow flex flex-col gap-xl">
      {/* Header */}
      <section className="flex flex-col gap-sm">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-surface">Favorites</h1>
        <p className="font-body-sm text-on-surface-variant">Your most frequently logged items.</p>
      </section>

      {/* Pinned Section */}
      <section className="flex flex-col gap-md">
        <h2 className="font-label-caps text-on-surface-variant tracking-widest uppercase">Pinned</h2>
        
        {isLoadingFavs ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-[#0B0B0B] border border-[#242424] rounded-[24px] p-lg flex flex-col items-center justify-center gap-md aspect-square animate-pulse">
                <div className="w-12 h-12 rounded-full bg-[#111111] border border-[#242424]"></div>
                <div className="w-20 h-4 bg-[#111111] rounded"></div>
              </div>
            ))}
          </div>
        ) : pinned.length === 0 ? (
          <div className="w-full py-xl text-center border border-[#242424] border-dashed rounded-[24px] text-on-surface-variant">
            Your pinned foods will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
            {pinned.map((item: FavoriteFoodDTO) => (
              <button 
                key={item.favoriteId}
                onClick={() => handleAddClick(item)}
                className="bg-[#0B0B0B] border border-[#242424] hover:border-white/15 rounded-[24px] p-lg flex flex-col items-center justify-center gap-md aspect-square text-left transition-all duration-200 hover:scale-95 group relative"
              >
                <div 
                  onClick={(e) => handleTogglePin(e, item.favoriteId!, item.isPinned)}
                  className="absolute top-4 left-4 text-[16px] text-[#242424] group-hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>push_pin</span>
                </div>

                <div className="w-12 h-12 rounded-full bg-[#111111] border border-[#242424] flex items-center justify-center group-hover:bg-[#1a1a1a] transition-colors">
                  <span className="material-symbols-outlined text-on-surface">{item.icon}</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="font-body-sm text-on-surface font-medium line-clamp-1">{item.name}</span>
                  <span className="font-label-muted text-on-surface-variant">{item.calories} kcal</span>
                </div>
                <span className="material-symbols-outlined text-[#242424] group-hover:text-primary absolute top-4 right-4 text-[16px] transition-colors">add</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Recent Foods */}
      <section className="flex flex-col gap-md">
        <h2 className="font-label-caps text-on-surface-variant tracking-widest uppercase">Recent</h2>
        
        {isLoadingRecents ? (
           <div className="flex flex-col border-t border-[#242424]">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex items-center justify-between py-md border-b border-[#242424] px-sm animate-pulse">
                 <div className="flex items-center gap-md">
                   <div className="w-10 h-10 rounded-full bg-[#111111]"></div>
                   <div className="flex flex-col gap-1">
                     <div className="w-32 h-4 bg-[#111111] rounded"></div>
                     <div className="w-20 h-3 bg-[#111111] rounded"></div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        ) : recents.length === 0 ? (
          <div className="w-full py-lg text-center text-on-surface-variant">
            No recent foods found.
          </div>
        ) : (
          <div className="flex flex-col border-t border-[#242424]">
            {recents.map((item: FavoriteFoodDTO) => (
              <div 
                key={`${item.source}-${item.foodId}`}
                onClick={() => handleAddClick(item)}
                className="flex items-center justify-between py-md border-b border-[#242424] group cursor-pointer hover:bg-[#0B0B0B] px-sm transition-colors rounded-lg"
              >
                <div className="flex items-center gap-md">
                  <div 
                    onClick={(e) => handleToggleFavorite(e, item.foodId, item.source)}
                    className="w-10 h-10 rounded-full bg-[#111111] border border-[#242424] flex items-center justify-center cursor-pointer transition-colors hover:border-primary"
                  >
                    <span 
                      className={twMerge(clsx(
                        "material-symbols-outlined text-[20px]",
                        item.isFavorite ? "text-primary" : "text-on-surface-variant"
                      ))}
                      style={item.isFavorite ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {item.isFavorite ? 'favorite' : 'favorite_border'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-sm text-on-surface font-medium">{item.name}</span>
                    <span className="font-label-muted text-on-surface-variant">{item.servingSize} • {item.calories} kcal</span>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full border border-[#242424] flex items-center justify-center hover:border-primary text-[#242424] hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* All Favorites */}
      <section className="flex flex-col gap-md">
        <h2 className="font-label-caps text-on-surface-variant tracking-widest uppercase">All Favorites</h2>
        
        {isLoadingFavs ? (
           <div className="flex flex-col border-t border-[#242424]">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex items-center justify-between py-md border-b border-[#242424] px-sm animate-pulse">
                 <div className="flex items-center gap-md">
                   <div className="w-10 h-10 rounded-full bg-[#111111]"></div>
                   <div className="flex flex-col gap-1">
                     <div className="w-32 h-4 bg-[#111111] rounded"></div>
                     <div className="w-20 h-3 bg-[#111111] rounded"></div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        ) : others.length === 0 ? (
          <div className="w-full py-lg text-center text-on-surface-variant border border-[#242424] border-dashed rounded-[24px]">
            No other favorites found.
          </div>
        ) : (
          <div className="flex flex-col border-t border-[#242424]">
            {others.map((item: FavoriteFoodDTO) => (
              <div 
                key={`${item.source}-${item.foodId}`}
                onClick={() => handleAddClick(item)}
                className="flex items-center justify-between py-md border-b border-[#242424] group cursor-pointer hover:bg-[#0B0B0B] px-sm transition-colors rounded-lg"
              >
                <div className="flex items-center gap-md">
                  <div 
                    onClick={(e) => handleToggleFavorite(e, item.foodId, item.source)}
                    className="w-10 h-10 rounded-full bg-[#111111] border border-[#242424] flex items-center justify-center cursor-pointer transition-colors hover:border-primary"
                  >
                    <span 
                      className={twMerge(clsx(
                        "material-symbols-outlined text-[20px]",
                        item.isFavorite ? "text-primary" : "text-on-surface-variant"
                      ))}
                      style={item.isFavorite ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {item.isFavorite ? 'favorite' : 'favorite_border'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-sm text-on-surface font-medium">{item.name}</span>
                    <span className="font-label-muted text-on-surface-variant">{item.servingSize} • {item.calories} kcal</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-sm">
                  <div 
                    onClick={(e) => handleTogglePin(e, item.favoriteId!, item.isPinned)}
                    className="w-8 h-8 rounded-full border border-transparent flex items-center justify-center hover:bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">push_pin</span>
                  </div>
                  <button className="w-8 h-8 rounded-full border border-[#242424] flex items-center justify-center hover:border-primary text-[#242424] hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Food Modals */}
      {selectedFood && (
        <FoodLogSheet 
          isOpen={isSheetOpen}
          onClose={() => {
            setIsSheetOpen(false);
            // Allow exit animation to finish before clearing food
            setTimeout(() => setSelectedFood(null), 300);
          }}
          initialMeal="Breakfast"
          initialFood={selectedFood}
        />
      )}
    </main>
  );
}
