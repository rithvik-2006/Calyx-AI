import { NextResponse } from 'next/server';
import { FavoriteService } from '@/services/favorite.service';
import { getSession } from '@/lib/auth';

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    
    const body = await request.json();
    if (!Array.isArray(body.order)) {
      return NextResponse.json({ success: false, message: 'order must be an array of IDs' }, { status: 400 });
    }

    await FavoriteService.reorderPins(session.userId, body.order);
    return NextResponse.json({ success: true, message: 'Reordered successfully' });
  } catch (error: any) {
    console.error('Reorder favorites error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
