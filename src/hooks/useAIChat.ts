import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { ChatMessage } from '@/services/ai.service';

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const chatMutation = useMutation({
    mutationFn: async (chatHistory: ChatMessage[]) => {
      // fetchApi unwraps { success: true, data: { ... } } and returns data directly
      return fetchApi<{ role: string, content: string }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: chatHistory }),
      });
    }
  });

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: content.trim() };
    const newMessages = [...messages, userMessage];
    
    // Optimistically update UI
    setMessages(newMessages);

    try {
      const response = await chatMutation.mutateAsync(newMessages);
      
      // Append assistant response
      if (response && response.content) {
        setMessages((prev) => [
          ...prev, 
          { role: 'assistant', content: response.content }
        ]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Append an error message from system just to notify user without breaking UI
      setMessages((prev) => [
        ...prev, 
        { role: 'system', content: 'Sorry, I encountered an error while processing your request. Please try again.' }
      ]);
    }
  };

  const clearChat = () => setMessages([]);

  return {
    messages,
    sendMessage,
    isLoading: chatMutation.isPending,
    error: chatMutation.error,
    clearChat
  };
}
