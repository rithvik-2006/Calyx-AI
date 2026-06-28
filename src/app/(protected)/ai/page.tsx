'use client';

import { useState } from 'react';

export default function AILoggerPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLog = () => {
    if (!input.trim()) return;
    setLoading(true);
    // Simulate AI parsing
    setTimeout(() => {
      setInput('');
      setLoading(false);
    }, 3000);
  };

  return (
    <main className="w-full max-w-[430px] px-lg flex-1 flex flex-col pt-xl pb-[100px]">
      {/* Header */}
      <section className="mb-xl">
        <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface mb-2">What did you eat?</h2>
        <p className="text-on-surface-variant font-body-sm">Log your meal using natural language or voice.</p>
      </section>

      {/* Input Area */}
      <section className="relative flex-1 flex flex-col min-h-[300px]">
        {/* Textarea container */}
        <div className="bg-[#0B0B0B] border border-[#242424] rounded-xl p-lg flex-1 flex flex-col relative transition-colors duration-300 focus-within:border-surface-tint/30">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-full bg-transparent border-none text-body-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/50 resize-none flex-1 pb-[60px] focus:outline-none focus:ring-0" 
            placeholder="e.g., I had two poached eggs on sourdough with half an avocado..."
          />
          
          {/* Controls anchored to bottom of card */}
          <div className="absolute bottom-lg left-lg right-lg flex justify-between items-center">
            <button aria-label="Voice input" className="w-12 h-12 rounded-full bg-[#111111] border border-[#242424] flex items-center justify-center text-on-surface hover:text-white hover:border-surface-tint/30 transition-all group">
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}>mic</span>
            </button>
            <button 
              onClick={handleLog}
              disabled={loading || !input.trim()}
              className="bg-white text-black font-label-caps px-6 py-3 rounded-full hover:bg-surface-tint transition-colors uppercase tracking-wider disabled:opacity-50"
            >
              Log Meal
            </button>
          </div>
        </div>

        {/* AI Feedback */}
        {loading && (
          <div className="mt-lg bg-[#0B0B0B] border border-[#242424] rounded-xl p-lg animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-surface-tint" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>robot_2</span>
              <span className="text-body-sm text-on-surface-variant">Parsing your meal...</span>
            </div>
            <div className="space-y-3">
              <div className="h-2 bg-[#242424] rounded-full w-3/4"></div>
              <div className="h-2 bg-[#242424] rounded-full w-1/2"></div>
              <div className="h-2 bg-[#242424] rounded-full w-5/6"></div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
