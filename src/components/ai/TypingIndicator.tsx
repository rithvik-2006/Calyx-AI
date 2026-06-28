import React from 'react';

export function TypingIndicator() {
  return (
    <div className="w-full flex justify-start mb-6 animate-in fade-in duration-300">
      <div className="max-w-[85%] flex flex-col items-start">
        <div className="flex items-center gap-2 mb-1.5 ml-1">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[14px] text-primary">eco</span>
          </div>
          <span className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Coach is typing</span>
        </div>
        
        <div className="bg-surface-container-low text-on-surface rounded-2xl rounded-tl-sm border border-[#242424] px-5 py-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
