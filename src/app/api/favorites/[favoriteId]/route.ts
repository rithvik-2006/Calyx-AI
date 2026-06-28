import { NextResponse } from 'next/server';
import { FavoriteService } from '@/services/favorite.service';
import { getSession } from '@/lib/auth';

export async function DELETE(request: Request, context: { params: Promise<{ favoriteId: string }> }) {
  try {
    const params = await context.params;
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    
    const favoriteId = parseInt(params.favoriteId);
    if (isNaN(favoriteId)) return NextResponse.json({ success: false, message: 'Invalid ID format' }, { status: 400 });

    await FavoriteService.deleteFavorite(session.userId, favoriteId);
    return NextResponse.json({ success: true, message: 'Removed from favorites' });
  } catch (error: any) {
    console.error('Delete favorite error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
