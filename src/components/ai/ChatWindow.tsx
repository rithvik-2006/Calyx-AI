import React, { useEffect, useRef } from 'react';
import { useAIChat } from '@/hooks/useAIChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';

export function ChatWindow() {
  const { messages, sendMessage, isLoading } = useAIChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="flex-1 overflow-y-auto px-4 sm:px-0 pb-[100px] pt-4 scrollbar-none flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center opacity-50 mb-10">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px] text-on-surface-variant">forum</span>
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">Nutrition AI Coach</h3>
            <p className="text-sm text-on-surface-variant text-center max-w-[280px]">
              Ask me about calories, healthy alternatives, or to analyze your meals.
            </p>
          </div>
        ) : (
          <div className="flex flex-col w-full pb-4">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} className="h-1 shrink-0" />
          </div>
        )}
      </div>

      <div className="fixed bottom-[80px] sm:bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-10 pointer-events-none">
        <div className="w-full max-w-[430px] mx-auto pointer-events-auto">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
