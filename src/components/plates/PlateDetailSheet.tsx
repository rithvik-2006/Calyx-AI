import { useState } from 'react';
import { PlateDTO } from '@/types/plate.types';
import { useLogPlate, useDeletePlate, useDuplicatePlate } from '@/hooks/usePlates';
import { PlateBuilder } from './PlateBuilder';

interface PlateDetailSheetProps {
  plate: PlateDTO;
  isOpen: boolean;
  onClose: () => void;
}

export function PlateDetailSheet({ plate, isOpen, onClose }: PlateDetailSheetProps) {
  const logMutation = useLogPlate();
  const deleteMutation = useDeletePlate();
  const duplicateMutation = useDuplicatePlate();

  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const handleLog = async () => {
    await logMutation.mutateAsync(plate.id);
    onClose();
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this plate?')) {
      await deleteMutation.mutateAsync(plate.id);
      onClose();
    }
  };

  const handleDuplicate = async () => {
    await duplicateMutation.mutateAsync(plate.id);
    onClose();
  };

  if (isEditing) {
    return (
      <PlateBuilder 
        isOpen={true}
        onClose={() => setIsEditing(false)}
        initialPlate={plate}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center px-0 sm:px-lg pb-24 sm:pb-0">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-[430px] h-auto max-h-[80vh] bg-[#121212] border border-[#242424] sm:rounded-2xl rounded-t-3xl p-6 flex flex-col shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300">
        
        {/* Top sheet handle wrapper for mobile */}
        <div className="w-12 h-1.5 bg-[#242424] rounded-full mx-auto sm:hidden absolute top-3 left-1/2 -translate-x-1/2"></div>
        
        {/* Title bar spacing */}
        <div className="flex justify-between items-start mt-3 sm:mt-0 mb-4 shrink-0">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-white">{plate.name}</h3>
            {plate.mealType && <span className="font-label-caps text-primary uppercase">{plate.mealType}</span>}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1c1c1e] text-gray-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form elements container */}
        <div className="overflow-y-auto flex flex-col gap-6 pr-1 pb-4 flex-1">
          {plate.description && (
            <p className="font-body-md text-on-surface-variant">{plate.description}</p>
          )}

          <div className="flex items-center justify-between py-md border-y border-[#242424]">
            <div className="flex flex-col items-center">
              <span className="font-headline-sm text-white">{plate.totalCalories}</span>
              <span className="font-label-muted text-gray-400 uppercase">kcal</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-headline-sm text-white">{plate.totalProtein}g</span>
              <span className="font-label-muted text-gray-400 uppercase">Protein</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-headline-sm text-white">{plate.totalFat}g</span>
              <span className="font-label-muted text-gray-400 uppercase">Fat</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-headline-sm text-white">{plate.totalCarbs}g</span>
              <span className="font-label-muted text-gray-400 uppercase">Carbs</span>
            </div>
          </div>

          <div className="flex flex-col gap-sm">
            <h4 className="font-label-caps text-gray-400 uppercase">Items ({plate.items.length})</h4>
            <div className="flex flex-col">
              {plate.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b border-[#242424] last:border-b-0">
                  <div className="flex flex-col">
                    <span className="font-body-md text-white font-medium">{item.name}</span>
                    <span className="font-body-sm text-gray-400">{item.quantity} x {item.servingSize}</span>
                  </div>
                  <span className="font-body-md text-gray-400">{Math.round(item.calories * item.quantity)} kcal</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button Section with visible top border accent */}
        <div className="border-t border-[#242424] pt-4 mt-2 shrink-0">
          <button 
            onClick={handleLog}
            disabled={logMutation.isPending}
            className="w-full py-3.5 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors flex justify-center items-center gap-2 mb-3"
          >
            {logMutation.isPending && (
               <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            )}
            {logMutation.isPending ? 'Logging...' : 'Log Plate'}
          </button>
          
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => setIsEditing(true)} className="py-2.5 bg-[#1c1c1e] text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
              Edit
            </button>
            <button onClick={handleDuplicate} disabled={duplicateMutation.isPending} className="py-2.5 bg-[#1c1c1e] text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
              Duplicate
            </button>
            <button onClick={handleDelete} disabled={deleteMutation.isPending} className="py-2.5 border border-red-900/50 text-red-500 rounded-xl font-medium hover:bg-red-500/10 transition-colors disabled:opacity-50">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
