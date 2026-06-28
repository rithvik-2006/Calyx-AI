import React from 'react';

interface QuantityInputProps {
  value: number;
  onChange: (val: number) => void;
}

export function QuantityInput({ value, onChange }: QuantityInputProps) {
  return (
    <div className="flex flex-col gap-xs">
      <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Quantity (Servings)</label>
      <div className="flex items-center gap-sm">
        <button
          type="button"
          onClick={() => onChange(Math.max(0.1, Number((value - 0.5).toFixed(2))))}
          className="w-10 h-10 rounded-lg bg-[#0B0B0B] border border-[#242424] text-on-surface hover:bg-surface-container-low transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[20px]">remove</span>
        </button>
        <input 
          type="number"
          min="0.1"
          step="0.1"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="flex-1 h-10 text-center bg-[#0B0B0B] border border-[#242424] rounded-lg text-on-surface font-headline-sm focus:outline-none focus:border-on-surface transition-colors"
        />
        <button
          type="button"
          onClick={() => onChange(Number((value + 0.5).toFixed(2)))}
          className="w-10 h-10 rounded-lg bg-[#0B0B0B] border border-[#242424] text-on-surface hover:bg-surface-container-low transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>
      </div>
    </div>
  );
}
