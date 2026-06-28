import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-[#121212] border border-[#242424] rounded-2xl p-2 flex items-end gap-2 transition-colors focus-within:border-primary/50 shadow-lg">
      {/* <button 
        className="w-10 h-10 flex items-center justify-center shrink-0 text-on-surface-variant hover:text-on-surface transition-colors rounded-xl"
        disabled={disabled}
      >
        <span className="material-symbols-outlined text-[24px]">mic</span>
      </button>
       */}
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about calories, macros, or meals..."
        disabled={disabled}
        className="flex-1 max-h-[120px] bg-transparent resize-none outline-none text-on-surface font-body-md py-1.5 placeholder:text-on-surface-variant/50 scrollbar-none"
        rows={1}
      />
      
      <button 
        onClick={handleSend}
        disabled={!input.trim() || disabled}
        className={`
          w-10 h-10 flex items-center justify-center shrink-0 rounded-xl transition-all duration-200
          ${input.trim() && !disabled 
            ? 'bg-primary text-background scale-100 opacity-100' 
            : 'bg-surface-container text-on-surface-variant scale-95 opacity-50 cursor-not-allowed'}
        `}
      >
        <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
      </button>
    </div>
  );
}
