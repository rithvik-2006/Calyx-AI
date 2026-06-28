import { NextResponse } from 'next/server';
import { FavoriteService } from '@/services/favorite.service';
import { getSession } from '@/lib/auth';

export async function PATCH(request: Request, context: { params: Promise<{ favoriteId: string }> }) {
  try {
    const params = await context.params;
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    
    const favoriteId = parseInt(params.favoriteId);
    if (isNaN(favoriteId)) return NextResponse.json({ success: false, message: 'Invalid ID format' }, { status: 400 });

    const body = await request.json();
    if (typeof body.isPinned !== 'boolean') {
      return NextResponse.json({ success: false, message: 'isPinned must be a boolean' }, { status: 400 });
    }

    await FavoriteService.pinFavorite(session.userId, favoriteId, body.isPinned);
    return NextResponse.json({ success: true, message: body.isPinned ? 'Pinned successfully' : 'Unpinned successfully' });
  } catch (error: any) {
    console.error('Pin favorite error:', error);
    if (error.message.includes('Maximum')) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
