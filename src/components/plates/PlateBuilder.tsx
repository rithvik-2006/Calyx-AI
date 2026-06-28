import { useState, useEffect } from 'react';
import { PlateDTO, CreatePlateInput } from '@/types/plate.types';
import { useCreatePlate, useUpdatePlate } from '@/hooks/usePlates';
import { FoodSearchInput } from '../dashboard/FoodSearchInput';
import { FoodDTO } from '@/types/food.types';
import { FavoriteFoodDTO } from '@/types/favorite.types';

interface PlateBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlate?: PlateDTO;
}

export function PlateBuilder({ isOpen, onClose, initialPlate }: PlateBuilderProps) {
  const createMutation = useCreatePlate();
  const updateMutation = useUpdatePlate();

  const [name, setName] = useState(initialPlate?.name || '');
  const [description, setDescription] = useState(initialPlate?.description || '');
  const [mealType, setMealType] = useState(initialPlate?.mealType || 'Breakfast');
  const [items, setItems] = useState<any[]>(initialPlate?.items || []);

  const [searchFood, setSearchFood] = useState<FoodDTO | FavoriteFoodDTO | null>(null);
  const [searchQuantity, setSearchQuantity] = useState(1);

  // Smart defaults based on name
  useEffect(() => {
    if (!initialPlate && name) {
      const lower = name.toLowerCase();
      if (lower.includes('breakfast')) setMealType('Breakfast');
      else if (lower.includes('lunch')) setMealType('Lunch');
      else if (lower.includes('dinner')) setMealType('Dinner');
      else if (lower.includes('snack')) setMealType('Snack');
    }
  }, [name, initialPlate]);

  if (!isOpen) return null;

  const handleAddFood = () => {
    if (!searchFood) return;
    
    const foodId = 'foodId' in searchFood ? searchFood.foodId : searchFood.id;
    
    setItems([...items, {
      foodId: foodId,
      source: searchFood.source,
      name: searchFood.name,
      calories: searchFood.calories,
      protein: searchFood.protein,
      fat: searchFood.fat,
      carbs: searchFood.carbs,
      servingSize: searchFood.servingSize,
      quantity: searchQuantity
    }]);
    
    setSearchFood(null);
    setSearchQuantity(1);
  };

  const handleRemoveFood = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name) return;

    const input: CreatePlateInput = {
      name,
      description,
      mealType,
      items: items.map(i => ({
        foodId: i.foodId,
        source: i.source,
        quantity: i.quantity
      }))
    };

    if (initialPlate) {
      await updateMutation.mutateAsync({ plateId: initialPlate.id, input });
    } else {
      await createMutation.mutateAsync(input);
    }

    onClose();
  };

  const totalCalories = items.reduce((acc, item) => acc + (item.calories * item.quantity), 0);
  const totalProtein = items.reduce((acc, item) => acc + (item.protein * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center px-0 sm:px-lg pb-24 sm:pb-0">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-[420px] h-auto max-h-[80vh] bg-[#121212] border border-[#242424] sm:rounded-2xl rounded-t-3xl p-6 flex flex-col shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300">
        
        {/* Top Handle */}
        <div className="w-12 h-1.5 bg-[#242424] rounded-full mx-auto sm:hidden absolute top-3 left-1/2 -translate-x-1/2"></div>
        
        <div className="flex justify-between items-center mt-3 sm:mt-0 mb-4 shrink-0">
          <h3 className="text-xl font-bold text-white">{initialPlate ? 'Edit Plate' : 'Create Plate'}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1c1c1e] text-gray-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-5 pr-1 pb-4">
          
          <div className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Plate Name (e.g. Breakfast Plate)" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b border-[#242424] pb-2 text-xl font-bold text-white focus:outline-none focus:border-white placeholder:text-gray-500 transition-colors"
            />
            <input 
              type="text" 
              placeholder="Description (optional)" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-400 focus:outline-none placeholder:text-gray-600"
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Meal Type</label>
            <select 
              value={mealType} 
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-4 py-3 bg-[#1c1c1e] border border-[#242424] rounded-xl text-white focus:outline-none focus:border-gray-500"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Snack">Snack</option>
              <option value="Dinner">Dinner</option>
              <option value="Custom">Custom / Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#242424] pt-4 mt-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Nutrition</h4>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-white">{Math.round(totalCalories)} <span className="text-sm font-normal text-gray-400">kcal</span></span>
              <span className="w-1 h-1 bg-[#242424] rounded-full"></span>
              <span className="text-lg font-bold text-white">{Math.round(totalProtein)}g <span className="text-sm font-normal text-gray-400">Protein</span></span>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Foods ({items.length})</h4>
            <div className="flex flex-col gap-2">
              {items.map((item, idx) => (
                <div key={idx} className="bg-[#1c1c1e] rounded-xl p-3 border border-[#242424] flex justify-between items-center group">
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-medium">{item.name}</span>
                    <span className="text-xs text-gray-400 mt-1">{item.quantity} x {item.servingSize} • {Math.round(item.calories * item.quantity)} kcal</span>
                  </div>
                  <button onClick={() => handleRemoveFood(idx)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-red-500/10">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-[#111111] border border-[#242424] rounded-xl p-4 mt-2 flex flex-col gap-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Add Food</span>
              <FoodSearchInput selectedFood={searchFood as any} onSelect={setSearchFood} />
              
              {searchFood && (
                <div className="flex items-center gap-3 mt-1">
                  <input 
                    type="number" 
                    min="0.1" 
                    step="0.1"
                    value={searchQuantity}
                    onChange={(e) => setSearchQuantity(Number(e.target.value))}
                    className="w-20 px-3 py-2 bg-[#1c1c1e] border border-[#242424] rounded-lg text-white text-center focus:outline-none"
                  />
                  <span className="text-sm text-gray-400 flex-1 line-clamp-1">{searchFood.servingSize}</span>
                  <button onClick={handleAddFood} className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200">
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="border-t border-[#242424] pt-4 mt-2 shrink-0">
          <button 
            onClick={handleSave}
            disabled={!name || items.length === 0 || createMutation.isPending || updateMutation.isPending}
            className="w-full py-3.5 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {(createMutation.isPending || updateMutation.isPending) && (
               <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            )}
            {createMutation.isPending || updateMutation.isPending ? 'Saving...' : (initialPlate ? 'Save Changes' : 'Create Plate')}
          </button>
        </div>
      </div>
    </div>
  );
}
