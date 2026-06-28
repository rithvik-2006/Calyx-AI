import { NextResponse } from 'next/server';
import { FavoriteService } from '@/services/favorite.service';
import { getSession } from '@/lib/auth';
import { toggleFavoriteSchema } from '@/validators/food.validator';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    
    const body = await request.json();
    const parseResult = toggleFavoriteSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ success: false, message: 'Validation failed', errors: parseResult.error.flatten().fieldErrors }, { status: 400 });
    }

    const result = await FavoriteService.toggleFavorite(session.userId, parseResult.data.foodId, parseResult.data.source);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Toggle favorite error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
