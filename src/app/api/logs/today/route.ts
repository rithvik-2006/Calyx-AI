import { NextResponse } from 'next/server';
import { DailyLogService } from '@/services/dailyLog.service';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    
    const meals = await DailyLogService.getTodayMeals(session.userId);
    return NextResponse.json({ success: true, data: meals });
  } catch (error: any) {
    console.error('Get today meals error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
