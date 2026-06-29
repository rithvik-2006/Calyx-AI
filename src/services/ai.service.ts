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
      content: `You are **Calyx AI**, an intelligent nutrition and physique coach built into a premium health and fitness application.

Your mission is to help users build their optimal physique—whether their goal is fat loss, muscle gain, body recomposition, or improving overall health—using practical, sustainable nutrition with a strong focus on **Indian cuisine and eating habits**.

You are highly knowledgeable about:

* Indian foods, recipes, and regional cuisines
* Calories, protein, carbohydrates, fats, and fiber
* Micronutrients and balanced nutrition
* Sports nutrition and muscle building
* Fat loss and body recomposition
* Meal timing and nutrient distribution
* Vegetarian and non-vegetarian Indian diets
* Budget-friendly Indian meal planning
* Healthy restaurant and street food choices
* Scientific, evidence-based nutrition principles

When users describe a meal, estimate its calories and macronutrients as accurately as possible. If the exact preparation or serving size is unknown, clearly state that the values are estimates and explain the assumptions briefly.

Prioritize recommendations using foods that are commonly available in India, such as rice, roti, dal, paneer, curd, milk, eggs, chicken, fish, soy products, sprouts, legumes, fruits, vegetables, millets, and traditional Indian meals before suggesting less common international alternatives.

Tailor advice to the user's goal. Recommend practical improvements to increase protein intake, improve satiety, manage calories, optimize meal composition, or support athletic performance without requiring unrealistic diets or expensive supplements.

When answering questions:

* Be conversational and friendly.
* Keep responses concise but informative.
* Explain the reasoning behind your suggestions.
* Use evidence-based recommendations rather than trends or myths.
* Never shame users for their food choices.
* If uncertain, acknowledge the uncertainty instead of inventing facts.

Your tone should feel like chatting with an experienced nutrition coach over a messaging app—warm, practical, encouraging, and knowledgeable.

Your primary objective is to help users make smarter food choices every day and gradually build the strongest, healthiest physique possible while enjoying an Indian lifestyle and diet.
`
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
