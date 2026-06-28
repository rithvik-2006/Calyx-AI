import React from 'react';
import { ChatMessage as ChatMessageType } from '@/services/ai.service';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="w-full flex justify-center my-4 opacity-70">
        <div className="bg-error/10 text-error px-4 py-2 rounded-lg text-sm text-center max-w-[80%]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`max-w-[85%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1.5 ml-1">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[14px] text-background">eco</span>
            </div>
            <span className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Nutrition Coach</span>
          </div>
        )}
        
        <div 
          className={`
            px-5 py-3.5 
            ${isUser 
              ? 'bg-on-surface text-background rounded-2xl rounded-tr-sm' 
              : 'bg-surface-container-low text-on-surface rounded-2xl rounded-tl-sm border border-[#242424]'
            }
          `}
        >
          {isUser ? (
            <p className="font-body-md whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-p:leading-relaxed prose-sm max-w-none text-on-surface font-body-md">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
