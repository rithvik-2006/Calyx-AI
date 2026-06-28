'use client';

export default function AnalyticsPage() {
  return (
    <main className="max-w-container-max mx-auto px-gutter md:px-lg pt-md md:pt-xl mt-0 mb-xl flex flex-col w-full pb-32">
      <header className="mb-xl md:hidden">
        <h1 className="font-headline-lg-mobile text-on-surface">Analytics</h1>
      </header>

      <section className="space-y-md mb-xl">
        {/* Streak Counter */}
        <div className="flex items-center gap-sm mb-lg">
          <span className="material-symbols-outlined text-surface-tint" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          <span className="font-label-caps text-on-surface-variant">14 DAY STREAK</span>
        </div>

        {/* Big Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {/* Weekly Calories */}
          <article className="bg-[#0B0B0B] border border-[#242424] rounded-xl p-lg flex flex-col justify-between min-h-[200px] hover:border-white/15 transition-colors">
            <h2 className="font-label-caps text-on-surface-variant mb-auto uppercase">Weekly Calories</h2>
            <div>
              <div className="font-display-data text-on-surface mb-xs">14,250</div>
              <p className="font-body-sm text-outline">Avg 2,035 / day</p>
            </div>
            {/* Minimal Chart Representation */}
            <div className="mt-md flex items-end gap-2 h-16 w-full opacity-70">
              <div className="bg-surface-tint w-1/7 rounded-t-sm" style={{ height: '60%' }}></div>
              <div className="bg-surface-tint w-1/7 rounded-t-sm" style={{ height: '80%' }}></div>
              <div className="bg-surface-tint w-1/7 rounded-t-sm" style={{ height: '40%' }}></div>
              <div className="bg-surface-tint w-1/7 rounded-t-sm" style={{ height: '90%' }}></div>
              <div className="bg-surface-tint w-1/7 rounded-t-sm" style={{ height: '70%' }}></div>
              <div className="bg-surface-tint w-1/7 rounded-t-sm" style={{ height: '50%' }}></div>
              <div className="bg-primary w-1/7 rounded-t-sm" style={{ height: '100%' }}></div>
            </div>
          </article>

          {/* Protein Average */}
          <article className="bg-[#0B0B0B] border border-[#242424] rounded-xl p-lg flex flex-col justify-between min-h-[200px] hover:border-white/15 transition-colors">
            <h2 className="font-label-caps text-on-surface-variant mb-auto uppercase">Protein Average</h2>
            <div>
              <div className="font-display-data text-on-surface mb-xs">142g</div>
              <p className="font-body-sm text-outline">Goal: 150g / day</p>
            </div>
            {/* Progress Arc Representation (Linear for minimalism) */}
            <div className="mt-md w-full">
              <div className="h-1 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                <div className="h-full bg-[#e2e2e2] rounded-full" style={{ width: '94%' }}></div>
              </div>
              <div className="flex justify-between mt-sm font-label-muted text-on-surface-variant">
                <span>0g</span>
                <span>150g</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Most Eaten Foods */}
      <section className="bg-[#0B0B0B] border border-[#242424] rounded-xl p-lg mb-xl">
        <h2 className="font-label-caps text-on-surface-variant mb-lg uppercase">Most Eaten Foods</h2>
        <ul className="flex flex-col">
          <li className="py-md border-b border-[#242424] flex items-center justify-between group last:border-b-0">
            <div className="w-1/2">
              <span className="font-body-lg text-on-surface block mb-xs group-hover:text-primary transition-colors">Chicken Breast</span>
              <span className="font-label-muted text-outline">12 times this week</span>
            </div>
            <div className="w-1/3 flex items-center">
              <div className="h-1 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                <div className="h-full bg-[#e2e2e2] rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </li>
          <li className="py-md border-b border-[#242424] flex items-center justify-between group last:border-b-0">
            <div className="w-1/2">
              <span className="font-body-lg text-on-surface block mb-xs group-hover:text-primary transition-colors">Oatmeal</span>
              <span className="font-label-muted text-outline">10 times this week</span>
            </div>
            <div className="w-1/3 flex items-center">
              <div className="h-1 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                <div className="h-full bg-[#e2e2e2] rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </li>
          <li className="py-md border-b border-[#242424] flex items-center justify-between group last:border-b-0">
            <div className="w-1/2">
              <span className="font-body-lg text-on-surface block mb-xs group-hover:text-primary transition-colors">Greek Yogurt</span>
              <span className="font-label-muted text-outline">8 times this week</span>
            </div>
            <div className="w-1/3 flex items-center">
              <div className="h-1 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                <div className="h-full bg-[#e2e2e2] rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
          </li>
          <li className="py-md border-b border-[#242424] flex items-center justify-between group last:border-b-0">
            <div className="w-1/2">
              <span className="font-body-lg text-on-surface block mb-xs group-hover:text-primary transition-colors">Almonds</span>
              <span className="font-label-muted text-outline">5 times this week</span>
            </div>
            <div className="w-1/3 flex items-center">
              <div className="h-1 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                <div className="h-full bg-[#e2e2e2] rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </main>
  );
}
