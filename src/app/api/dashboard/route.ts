import { NextResponse } from 'next/server';
import { DashboardService } from '@/services/dashboard.service';
import { getSession } from '@/lib/auth';
import { dateQuerySchema } from '@/validators/log.validator';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized', errors: [] }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateQuery = searchParams.get('date') || undefined;

    const parseResult = dateQuerySchema.safeParse({ date: dateQuery });
    if (!parseResult.success) {
      return NextResponse.json({ success: false, message: 'Invalid query parameters', errors: parseResult.error.flatten().fieldErrors }, { status: 400 });
    }

    const dashboardData = await DashboardService.getDashboardData(session.userId, parseResult.data.date);
    return NextResponse.json({ success: true, data: dashboardData });

  } catch (error: any) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error', errors: [] }, { status: 500 });
  }
}
