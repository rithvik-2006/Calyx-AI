import { create } from 'zustand';

export interface MacroGoals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface DailyLog {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface NutritionState {
  goals: MacroGoals;
  dailyLog: DailyLog;
  setGoals: (goals: Partial<MacroGoals>) => void;
  updateDailyLog: (log: Partial<DailyLog>) => void;
  addFoodToLog: (food: { calories: number; protein: number; fat: number; carbs: number }) => void;
}

export const useNutritionStore = create<NutritionState>((set) => ({
  goals: {
    calories: 2350,
    protein: 150,
    fat: 70,
    carbs: 250,
  },
  dailyLog: {
    calories: 1820,
    protein: 120,
    fat: 45,
    carbs: 210,
  },
  setGoals: (newGoals) => set((state) => ({ goals: { ...state.goals, ...newGoals } })),
  updateDailyLog: (log) => set((state) => ({ dailyLog: { ...state.dailyLog, ...log } })),
  addFoodToLog: (food) => set((state) => ({
    dailyLog: {
      calories: state.dailyLog.calories + food.calories,
      protein: state.dailyLog.protein + food.protein,
      fat: state.dailyLog.fat + food.fat,
      carbs: state.dailyLog.carbs + food.carbs,
    }
  })),
}));
