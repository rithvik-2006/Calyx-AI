'use client';

import { useState } from 'react';
import { usePlates } from '@/hooks/usePlates';
import { PlateDTO } from '@/types/plate.types';
import { PlateCard } from '@/components/plates/PlateCard';
import { PlateDetailSheet } from '@/components/plates/PlateDetailSheet';
import { PlateBuilder } from '@/components/plates/PlateBuilder';

export default function PlatesPage() {
  const { data: platesRes, isLoading } = usePlates();
  
  const [selectedPlate, setSelectedPlate] = useState<PlateDTO | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const dailyPlates = platesRes?.daily || [];
  const customPlates = platesRes?.custom || [];

  const handlePlateClick = (plate: PlateDTO) => {
    setSelectedPlate(plate);
    setIsDetailOpen(true);
  };

  return (
    <main className="w-full max-w-[720px] mx-auto px-lg md:px-lg pt-xl pb-32 flex-grow flex flex-col gap-xl min-h-screen">
      <section className="flex flex-col gap-sm">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-surface">My Plates</h1>
        <p className="font-body-sm text-on-surface-variant">Reusable meals to log with a single tap.</p>
      </section>

      {/* Daily Plates */}
      <section className="flex flex-col gap-md">
        <h2 className="font-label-caps text-on-surface-variant tracking-widest uppercase">Daily Plates</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {[1, 2].map(i => (
              <div key={i} className="bg-surface border border-[#242424] rounded-[24px] p-lg flex flex-col gap-sm animate-pulse h-32">
                <div className="w-32 h-6 bg-surface-container-low rounded"></div>
                <div className="w-48 h-4 bg-surface-container-low rounded mt-auto"></div>
              </div>
            ))}
          </div>
        ) : dailyPlates.length === 0 ? (
          <div className="w-full py-xl text-center border border-[#242424] border-dashed rounded-[24px] text-on-surface-variant">
            Create a plate with a meal type (Breakfast, Lunch, etc.) to see it here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {dailyPlates.map(plate => (
              <PlateCard 
                key={plate.id}
                plate={plate}
                isDaily={true}
                onClick={() => handlePlateClick(plate)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Custom Plates */}
      <section className="flex flex-col gap-md">
        <h2 className="font-label-caps text-on-surface-variant tracking-widest uppercase">Custom Plates</h2>
        
        {isLoading ? (
          <div className="flex flex-col gap-sm">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#0B0B0B] border border-[#242424] rounded-xl p-md flex items-center justify-between animate-pulse">
                <div className="w-32 h-4 bg-surface-container-low rounded"></div>
              </div>
            ))}
          </div>
        ) : customPlates.length === 0 ? (
          <div className="w-full py-lg text-center text-on-surface-variant">
            No custom plates found.
          </div>
        ) : (
          <div className="flex flex-col gap-sm">
            {customPlates.map(plate => (
              <PlateCard 
                key={plate.id}
                plate={plate}
                isDaily={false}
                onClick={() => handlePlateClick(plate)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Suggested Plates Placeholder */}
      <section className="flex flex-col gap-md mt-lg opacity-50 pointer-events-none">
        <h2 className="font-label-caps text-on-surface-variant tracking-widest uppercase">Suggested For You</h2>
        <div className="w-full py-xl text-center border border-[#242424] border-dashed rounded-[24px] flex items-center justify-center gap-sm">
          <span className="material-symbols-outlined text-on-surface-variant">auto_awesome</span>
          <span className="font-body-md text-on-surface-variant">AI Suggestions coming soon...</span>
        </div>
      </section>

      {/* FAB */}
      <button 
        onClick={() => setIsBuilderOpen(true)}
        className="fixed bottom-24 right-6 md:absolute md:bottom-6 md:right-6 w-14 h-14 bg-on-surface text-background rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:bg-surface-tint hover:scale-105 active:scale-95 transition-all z-40"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {/* Modals */}
      {selectedPlate && (
        <PlateDetailSheet 
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setTimeout(() => setSelectedPlate(null), 300);
          }}
          plate={selectedPlate}
        />
      )}

      {isBuilderOpen && (
        <PlateBuilder 
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
        />
      )}
    </main>
  );
}
