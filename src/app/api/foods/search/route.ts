import { NextResponse } from 'next/server';
import { FoodService } from '@/services/food.service';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized', errors: [] }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
      return NextResponse.json({ success: true, data: [] });
    }

    const foods = await FoodService.search(q, session.userId);
    return NextResponse.json({ success: true, data: foods });
  } catch (error: any) {
    console.error('Food search error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', errors: [] }, { status: 500 });
  }
}
