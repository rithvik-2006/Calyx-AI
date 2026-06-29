export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AIService {
  private static NIM_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
  
  private static get apiKey() {
    const key = process.env.NVIDIA_API_KEY || process.env.NIM_API_KEY;
    return key?.trim();
  }

  private static get systemPrompt(): ChatMessage {
    return {
      role: 'system',
      content: `You are an experienced, friendly, and practical nutrition coach built into a premium health app.
Your goal is to help users with their nutrition queries, meal analysis, and diet advice.
Keep responses concise, evidence-based, and highly practical. Avoid robotic structures or excessive disclaimers.
When calculating or estimating macros/calories from a text description, be clear that it's an estimate, but provide a confident range.
Speak naturally, as if chatting on a messenger app.`
    };
  }

  static async chat(messages: ChatMessage[]): Promise<string> {
    const key = this.apiKey;
    
    if (!key) {
      throw new Error('NVIDIA API Key is missing. Please configure it in your environment variables.');
    }

    // Diagnostic logging for production debugging (helps identify mismatched keys on Vercel)
    console.log('[NVIDIA NIM API Debug]', {
      hasKey: !!key,
      first5: key.slice(0, 5),
      length: key.length,
      envVarSource: process.env.NVIDIA_API_KEY ? 'NVIDIA_API_KEY' : 'NIM_API_KEY'
    });

    // Ensure the system prompt is always injected first
    const fullConversation = [this.systemPrompt, ...messages];

    const response = await fetch(this.NIM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'meta/llama-3.3-70b-instruct',
        messages: fullConversation,
        temperature: 0.5,
        max_tokens: 1024,
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('NVIDIA NIM API Error:', response.status, errorData);
      
      try {
        const parsedError = JSON.parse(errorData);
        throw new Error(`AI Provider Error: ${parsedError.detail || parsedError.message || response.statusText}`);
      } catch (e) {
        throw new Error(`AI Provider Error: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }
    
    throw new Error('Invalid response format from AI provider.');
  }
}
