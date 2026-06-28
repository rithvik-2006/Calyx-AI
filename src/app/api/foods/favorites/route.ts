import { NextResponse } from 'next/server';
import { FavoriteService } from '@/services/favorite.service';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    
    const foods = await FavoriteService.getFavoritesData(session.userId);
    return NextResponse.json({ success: true, data: foods });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
