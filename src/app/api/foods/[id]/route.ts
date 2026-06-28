import { NextResponse } from 'next/server';
import { FoodRepository } from '@/repositories/food.repository';
import { getSession } from '@/lib/auth';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ success: false, message: 'Invalid ID format' }, { status: 400 });

    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');

    let food;
    if (source === 'custom_foods') {
      food = await FoodRepository.getCustomFoodById(id, session.userId);
    } else {
      food = await FoodRepository.getFoodMasterById(id);
    }

    if (!food) {
      return NextResponse.json({ success: false, message: 'Food not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { ...food, source: source || 'food_master' } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
