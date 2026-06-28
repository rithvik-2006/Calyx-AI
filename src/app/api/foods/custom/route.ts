import { NextResponse } from 'next/server';
import { FoodService } from '@/services/food.service';
import { getSession } from '@/lib/auth';
import { customFoodSchema } from '@/validators/food.validator';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    
    const body = await request.json();
    const parseResult = customFoodSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ success: false, message: 'Validation failed', errors: parseResult.error.flatten().fieldErrors }, { status: 400 });
    }

    const customFood = await FoodService.createCustomFood(session.userId, parseResult.data);
    return NextResponse.json({ success: true, data: customFood });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
