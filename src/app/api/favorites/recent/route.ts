import { NextResponse } from 'next/server';
import { FavoriteService } from '@/services/favorite.service';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    
    const recent = await FavoriteService.getRecentFoods(session.userId);
    return NextResponse.json({ success: true, data: recent });
  } catch (error: any) {
    console.error('Get recent foods error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
