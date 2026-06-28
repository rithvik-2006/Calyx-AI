export interface DashboardMealDTO {
  meal: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';
  items: number;
  calories: number;
}

export interface MacroDetailDTO {
  current: number;
  goal: number;
  percentage: number;
}

export interface DashboardResponseDTO {
  date: string; // 'YYYY-MM-DD'
  calories: {
    consumed: number;
    goal: number;
    remaining: number;
    percentage: number;
  };
  macros: {
    protein: MacroDetailDTO;
    fat: MacroDetailDTO;
    carbs: MacroDetailDTO;
  };
  meals: DashboardMealDTO[];
}
