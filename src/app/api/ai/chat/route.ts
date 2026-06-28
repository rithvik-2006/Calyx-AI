import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { AIService, ChatMessage } from '@/services/ai.service';
import { z } from 'zod';

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string()
    })
  )
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = chatSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: parseResult.error.flatten().fieldErrors }, 
        { status: 400 }
      );
    }

    const messages = parseResult.data.messages as ChatMessage[];
    
    // Only allow recent context, e.g., last 10 messages max to prevent huge payloads
    const recentMessages = messages.slice(-10);

    const responseText = await AIService.chat(recentMessages);

    return NextResponse.json({ 
      success: true, 
      data: {
        role: 'assistant',
        content: responseText
      }
    });

  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' }, 
      { status: 500 }
    );
  }
}
