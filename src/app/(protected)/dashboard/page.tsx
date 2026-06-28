'use client';

import { useEffect, useState } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { useTodayMeals } from '@/hooks/useLogs';
import { format } from 'date-fns';
import { MealCard } from '@/components/dashboard/MealCard';
import { FoodLogSheet } from '@/components/dashboard/FoodLogSheet';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');

  const { data: dashboard, isLoading } = useDashboard();
  const { data: todayMealsResponse } = useTodayMeals();
  const todayMeals = todayMealsResponse;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading || !dashboard) {
    return (
      <main className="w-full max-w-[430px] px-lg pt-xl flex flex-col gap-xl items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 border-4 border-surface-tint border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  const offset = mounted ? (251.2 - (251.2 * dashboard.calories.percentage) / 100) : 251.2;

  return (
    <main className="w-full max-w-[430px] px-lg pt-xl flex flex-col gap-xl">
      {/* Header */}
      <header className="flex flex-col gap-xs">
        <span className="font-label-muted text-on-surface-variant uppercase tracking-wider">
          {format(new Date(dashboard.date), 'MMM d, yyyy')}
        </span>
        <h1 className="font-headline-lg-mobile text-on-surface font-semibold tracking-tight">
          Good Morning, Rithvik
        </h1>
      </header>

      {/* Calorie Progress */}
      <section className="flex justify-center items-center py-lg relative">
        <div className="relative w-64 h-64 flex justify-center items-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Track */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1A1A1A" strokeWidth="4" />
            {/* Progress */}
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="transparent" 
              stroke="#c6c6c6" 
              strokeWidth="4" 
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                strokeDasharray: 251.2,
                strokeDashoffset: offset
              }}
            />
          </svg>
          <div className="flex flex-col items-center justify-center z-10">
            <span className="font-display-data text-on-surface tracking-tighter">{dashboard.calories.consumed.toLocaleString()}</span>
            <span className="font-label-muted text-on-surface-variant mt-1">/ {dashboard.calories.goal.toLocaleString()} kcal</span>
          </div>
        </div>
      </section>

      {/* Macros */}
      <section className="bg-[#0B0B0B] border border-[#242424] rounded-xl p-lg flex flex-col gap-md">
        {/* Protein */}
        <div className="flex flex-col gap-sm">
          <div className="flex justify-between items-center">
            <span className="font-label-caps text-on-surface uppercase">Protein</span>
            <span className="font-body-sm text-on-surface-variant">{dashboard.macros.protein.current}g / {dashboard.macros.protein.goal}g</span>
          </div>
          <div className="w-full h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div className="h-full bg-on-surface rounded-full transition-all duration-1000" style={{ width: `${dashboard.macros.protein.percentage}%` }} />
          </div>
        </div>

        {/* Fat */}
        <div className="flex flex-col gap-sm">
          <div className="flex justify-between items-center">
            <span className="font-label-caps text-on-surface uppercase">Fat</span>
            <span className="font-body-sm text-on-surface-variant">{dashboard.macros.fat.current}g / {dashboard.macros.fat.goal}g</span>
          </div>
          <div className="w-full h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div className="h-full bg-on-surface-variant rounded-full transition-all duration-1000" style={{ width: `${dashboard.macros.fat.percentage}%` }} />
          </div>
        </div>

        {/* Carbs */}
        <div className="flex flex-col gap-sm">
          <div className="flex justify-between items-center">
            <span className="font-label-caps text-on-surface uppercase">Carbs</span>
            <span className="font-body-sm text-on-surface-variant">{dashboard.macros.carbs.current}g / {dashboard.macros.carbs.goal}g</span>
          </div>
          <div className="w-full h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div className="h-full bg-outline rounded-full transition-all duration-1000" style={{ width: `${dashboard.macros.carbs.percentage}%` }} />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-sm pb-xl">
        {dashboard.meals.map((mealData) => (
          <MealCard 
            key={mealData.meal}
            mealName={mealData.meal}
            itemCount={mealData.items}
            totalCalories={mealData.calories}
            items={todayMeals?.[mealData.meal as keyof typeof todayMeals] || []}
            onAddClick={(meal) => {
              setSelectedMeal(meal);
              setIsSheetOpen(true);
            }}
          />
        ))}
      </section>

      {/* FAB */}
      <div className="fixed bottom-[100px] right-6 md:right-[calc(50%-180px)] flex flex-col items-end gap-sm z-40">
        
        {/* Expanded Options */}
        {isFabOpen && (
          <div className="flex flex-col gap-sm items-end animate-in slide-in-from-bottom-5 fade-in duration-200">
            <button 
              onClick={() => {
                setIsFabOpen(false);
                setSelectedMeal('Breakfast');
                setIsSheetOpen(true);
              }}
              className="flex items-center gap-sm bg-surface-container border border-[#242424] text-on-surface px-md py-sm rounded-full shadow-lg hover:bg-surface-container-high transition-colors"
            >
              <span className="font-body-md font-medium">Add Food</span>
              <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">search</span>
              </div>
            </button>
            <button 
              onClick={() => {
                setIsFabOpen(false);
                window.location.href = '/plates';
              }}
              className="flex items-center gap-sm bg-surface-container border border-[#242424] text-on-surface px-md py-sm rounded-full shadow-lg hover:bg-surface-container-high transition-colors"
            >
              <span className="font-body-md font-medium">Log Plate</span>
              <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
              </div>
            </button>
          </div>
        )}

        <button 
          onClick={() => setIsFabOpen(!isFabOpen)}
          className="w-14 h-14 bg-on-surface text-primary-container rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform"
        >
          <span 
            className="material-symbols-outlined transition-transform duration-200" 
            style={{ 
              fontVariationSettings: "'FILL' 1",
              transform: isFabOpen ? 'rotate(45deg)' : 'rotate(0deg)'
            }}
          >
            add
          </span>
        </button>
      </div>

      <FoodLogSheet 
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        initialMeal={selectedMeal}
      />
    </main>
  );
}
