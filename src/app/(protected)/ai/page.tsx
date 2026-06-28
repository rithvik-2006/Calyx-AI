'use client';

import { ChatWindow } from '@/components/ai/ChatWindow';

export default function AILoggerPage() {
  return (
    <main className="w-full max-w-[430px] mx-auto flex-1 flex flex-col h-[100dvh] pt-safe sm:pt-xl relative overflow-hidden">
      {/* Header */}
      <section className="px-lg pt-6 pb-2 shrink-0 z-10 bg-background">
        <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface mb-1">AI Coach</h2>
        <p className="text-on-surface-variant font-body-sm">Chat about nutrition, calories, and healthy habits.</p>
      </section>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden relative">
        <ChatWindow />
      </div>
    </main>
  );
}
