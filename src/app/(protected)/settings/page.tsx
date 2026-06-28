'use client';

import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <main className="flex-grow flex flex-col items-center pt-xl pb-32 px-gutter w-full">
      <div className="w-full max-w-[400px] flex flex-col gap-xl">
        {/* Profile Header */}
        <section className="flex flex-col items-center gap-md">
          <div className="w-24 h-24 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden border border-[#242424]">
            {/* Using a solid color or initials since we don't have the image file */}
            <span className="text-display-data text-on-surface">R</span>
          </div>
          <div className="text-center">
            <h2 className="font-headline-lg-mobile text-on-surface">Rithvik</h2>
            <p className="font-body-sm text-on-surface-variant">rithvik@example.com</p>
          </div>
        </section>

        {/* Goals Card */}
        <section className="flex flex-col gap-sm">
          <h3 className="font-label-caps text-on-surface-variant px-sm uppercase">Goals</h3>
          <div className="bg-[#0B0B0B] border border-[#242424] rounded-lg flex flex-col overflow-hidden">
            <button className="flex items-center justify-between p-md border-b border-[#242424] hover:bg-surface-container-lowest transition-colors group text-left w-full">
              <span className="font-body-lg text-on-surface">Daily Calories</span>
              <div className="flex items-center gap-sm">
                <span className="font-body-sm text-on-surface-variant">2,400 kcal</span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface transition-colors">chevron_right</span>
              </div>
            </button>
            <button className="flex items-center justify-between p-md border-b border-[#242424] hover:bg-surface-container-lowest transition-colors group text-left w-full">
              <span className="font-body-lg text-on-surface">Macros (P/C/F)</span>
              <div className="flex items-center gap-sm">
                <span className="font-body-sm text-on-surface-variant">150g / 250g / 65g</span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface transition-colors">chevron_right</span>
              </div>
            </button>
            <button className="flex items-center justify-between p-md hover:bg-surface-container-lowest transition-colors group text-left w-full">
              <span className="font-body-lg text-on-surface">Fasting Window</span>
              <div className="flex items-center gap-sm">
                <span className="font-body-sm text-on-surface-variant">16:8</span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface transition-colors">chevron_right</span>
              </div>
            </button>
          </div>
        </section>

        {/* Preferences Card */}
        <section className="flex flex-col gap-sm">
          <h3 className="font-label-caps text-on-surface-variant px-sm uppercase">Preferences</h3>
          <div className="bg-[#0B0B0B] border border-[#242424] rounded-lg flex flex-col overflow-hidden">
            <button className="flex items-center justify-between p-md border-b border-[#242424] hover:bg-surface-container-lowest transition-colors group text-left w-full">
              <span className="font-body-lg text-on-surface">Units</span>
              <div className="flex items-center gap-sm">
                <span className="font-body-sm text-on-surface-variant">Metric (kg, ml)</span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface transition-colors">chevron_right</span>
              </div>
            </button>
            <button className="flex items-center justify-between p-md border-b border-[#242424] hover:bg-surface-container-lowest transition-colors group text-left w-full">
              <span className="font-body-lg text-on-surface">Theme</span>
              <div className="flex items-center gap-sm">
                <span className="font-body-sm text-on-surface-variant">Dark</span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface transition-colors">chevron_right</span>
              </div>
            </button>
            <button className="flex items-center justify-between p-md hover:bg-surface-container-lowest transition-colors group text-left w-full">
              <span className="font-body-lg text-on-surface">Notifications</span>
              <div className="flex items-center gap-sm">
                <span className="font-body-sm text-on-surface-variant">Enabled</span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface transition-colors">chevron_right</span>
              </div>
            </button>
          </div>
        </section>

        {/* Account Card */}
        <section className="flex flex-col gap-sm">
          <h3 className="font-label-caps text-on-surface-variant px-sm uppercase">Account</h3>
          <div className="bg-[#0B0B0B] border border-[#242424] rounded-lg flex flex-col overflow-hidden">
            <button className="flex items-center justify-between p-md border-b border-[#242424] hover:bg-surface-container-lowest transition-colors group text-left w-full">
              <span className="font-body-lg text-on-surface">Subscription</span>
              <div className="flex items-center gap-sm">
                <span className="font-body-sm text-on-surface-variant">Pro</span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface transition-colors">chevron_right</span>
              </div>
            </button>
            <button className="flex items-center justify-between p-md hover:bg-surface-container-lowest transition-colors group text-left w-full">
              <span className="font-body-lg text-on-surface">Data & Privacy</span>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface transition-colors">chevron_right</span>
            </button>
          </div>
        </section>

        <section className="pt-md pb-xl">
          <button 
            onClick={handleLogout}
            className="w-full py-md px-lg rounded border border-[#242424] text-error font-body-lg hover:bg-surface-container-lowest transition-colors"
          >
            Sign Out
          </button>
        </section>
      </div>
    </main>
  );
}
