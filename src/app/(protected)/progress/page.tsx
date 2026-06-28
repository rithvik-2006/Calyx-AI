'use client';

export default function ProgressPage() {
  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-lg pt-lg pb-32 flex flex-col gap-xl">
      {/* Hero: Main Display */}
      <section className="flex flex-col items-center justify-center text-center mt-md">
        <span className="font-label-caps text-on-surface-variant uppercase tracking-wider mb-sm">
          Current Weight
        </span>
        <div className="flex items-baseline gap-xs">
          <h1 className="font-display-data text-on-surface tabular-nums tracking-tighter">78.4</h1>
          <span className="font-headline-md text-on-surface-variant">kg</span>
        </div>
        <div className="mt-sm inline-flex items-center gap-xs px-sm py-xs rounded-full bg-surface-container border border-outline-variant">
          <span className="material-symbols-outlined text-[14px] text-primary">trending_down</span>
          <span className="font-label-muted text-primary">-1.2 kg this week</span>
        </div>
      </section>

      {/* Chart Section */}
      <section className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-lg relative overflow-hidden group hover:border-outline transition-colors duration-300">
        <div 
          className="absolute inset-0 opacity-50" 
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(152, 142, 144, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(152, 142, 144, 0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        ></div>
        <div className="relative z-10 flex justify-between items-center mb-lg">
          <span className="font-label-caps text-on-surface">Progress</span>
          <span className="font-label-muted text-on-surface-variant">Last 30 Days</span>
        </div>
        {/* Minimal SVG Line Graph */}
        <div className="w-full aspect-[2/1] relative">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" className="text-primary"></stop>
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-primary"></stop>
              </linearGradient>
            </defs>
            {/* Grid Lines */}
            <line x1="0" x2="100" y1="10" y2="10" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2,2" className="text-outline-variant" opacity="0.3"></line>
            <line x1="0" x2="100" y1="25" y2="25" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2,2" className="text-outline-variant" opacity="0.3"></line>
            <line x1="0" x2="100" y1="40" y2="40" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2,2" className="text-outline-variant" opacity="0.3"></line>
            {/* Data Area */}
            <path d="M0,40 Q10,38 20,35 T40,25 T60,28 T80,15 T100,10 L100,50 L0,50 Z" fill="url(#chartGradient)"></path>
            {/* Data Line */}
            <path d="M0,40 Q10,38 20,35 T40,25 T60,28 T80,15 T100,10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"></path>
            {/* Data Points */}
            <circle cx="80" cy="15" r="1.5" fill="currentColor" className="text-primary"></circle>
            <circle cx="100" cy="10" r="1.5" fill="currentColor" className="text-primary"></circle>
          </svg>
        </div>
        {/* Axis Labels */}
        <div className="flex justify-between mt-sm font-label-muted text-on-surface-variant opacity-60">
          <span>Oct 1</span>
          <span>Oct 15</span>
          <span>Oct 31</span>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-2 gap-md">
        {/* Weekly Average */}
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg flex flex-col gap-sm hover:border-outline transition-colors duration-300">
          <span className="font-label-caps text-on-surface-variant uppercase">Weekly Avg</span>
          <div className="flex items-baseline gap-xs">
            <span className="font-headline-lg text-on-surface tabular-nums">78.8</span>
            <span className="font-body-sm text-on-surface-variant">kg</span>
          </div>
        </div>
        {/* Monthly Average */}
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg flex flex-col gap-sm hover:border-outline transition-colors duration-300">
          <span className="font-label-caps text-on-surface-variant uppercase">Monthly Avg</span>
          <div className="flex items-baseline gap-xs">
            <span className="font-headline-lg text-on-surface tabular-nums">79.5</span>
            <span className="font-body-sm text-on-surface-variant">kg</span>
          </div>
        </div>
      </section>

      {/* Consistency Score */}
      <section className="bg-surface-container-low border border-outline-variant rounded-xl p-lg flex flex-col gap-md">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-xs">
            <span className="font-label-caps text-on-surface-variant uppercase">Consistency Score</span>
            <span className="font-body-sm text-on-surface-variant">Based on daily weigh-ins</span>
          </div>
          <span className="font-headline-md text-primary">85%</span>
        </div>
        {/* Minimal Progress Line */}
        <div className="w-full h-[2px] bg-surface-container-highest rounded-full overflow-hidden mt-xs">
          <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out w-[85%]"></div>
        </div>
      </section>
    </main>
  );
}
