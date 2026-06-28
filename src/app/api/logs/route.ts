import { NextResponse } from 'next/server';
import { DailyLogService } from '@/services/dailyLog.service';
import { getSession } from '@/lib/auth';
import { addFoodLogSchema } from '@/validators/log.validator';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized', errors: [] }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = addFoodLogSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ success: false, message: 'Validation failed', errors: parseResult.error.flatten().fieldErrors }, { status: 400 });
    }

    const result = await DailyLogService.addFood(session.userId, parseResult.data);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Add food error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error', errors: [] }, { status: 500 });
  }
}
