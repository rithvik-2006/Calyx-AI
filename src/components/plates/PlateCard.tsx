import { PlateDTO } from '@/types/plate.types';
import { formatDistanceToNow } from 'date-fns';

interface PlateCardProps {
  plate: PlateDTO;
  onClick: () => void;
  isDaily?: boolean;
}

export function PlateCard({ plate, onClick, isDaily = false }: PlateCardProps) {
  if (isDaily) {
    return (
      <div 
        onClick={onClick}
        className="bg-surface border border-[#242424] rounded-[24px] p-lg flex flex-col gap-sm cursor-pointer hover:border-on-surface-variant transition-colors group relative overflow-hidden"
      >
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h3 className="font-headline-md text-on-surface">{plate.name}</h3>
            {plate.description && (
              <span className="font-body-sm text-on-surface-variant line-clamp-1">{plate.description}</span>
            )}
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-background transition-colors">
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </div>
        </div>

        <div className="flex items-center gap-md mt-sm">
          <div className="flex flex-col">
            <span className="font-headline-sm text-on-surface">{plate.totalCalories}</span>
            <span className="font-label-muted text-on-surface-variant uppercase">kcal</span>
          </div>
          <div className="w-[1px] h-8 bg-[#242424]"></div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-on-surface">{plate.totalProtein}g</span>
            <span className="font-label-muted text-on-surface-variant uppercase">Protein</span>
          </div>
          <div className="w-[1px] h-8 bg-[#242424]"></div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-on-surface">{plate.items.length}</span>
            <span className="font-label-muted text-on-surface-variant uppercase">Foods</span>
          </div>
        </div>
      </div>
    );
  }

  // Custom Plate Style
  return (
    <div 
      onClick={onClick}
      className="bg-[#0B0B0B] border border-[#242424] rounded-xl p-md flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors group"
    >
      <div className="flex flex-col gap-xs">
        <h4 className="font-body-lg text-on-surface font-semibold">{plate.name}</h4>
        <div className="flex items-center gap-sm">
          <span className="font-body-sm text-on-surface-variant">{plate.totalCalories} kcal</span>
          <span className="w-1 h-1 rounded-full bg-[#242424]"></span>
          <span className="font-body-sm text-on-surface-variant">{plate.items.length} foods</span>
          <span className="w-1 h-1 rounded-full bg-[#242424]"></span>
          <span className="font-body-sm text-on-surface-variant">
            {formatDistanceToNow(new Date(plate.updatedAt), { addSuffix: true })}
          </span>
        </div>
      </div>
      <div className="text-[#242424] group-hover:text-primary transition-colors">
        <span className="material-symbols-outlined">chevron_right</span>
      </div>
    </div>
  );
}
