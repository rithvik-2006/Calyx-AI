import { NextResponse } from 'next/server';
import { DailyLogRepository } from '@/repositories/dailyLog.repository';
import { getSession } from '@/lib/auth';

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized', errors: [] }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: 'Invalid ID format', errors: [] }, { status: 400 });
    }

    // A real implementation would also verify the item belongs to the user's log
    // We need the log ID to recalculate totals
    const { db } = await import('@/db');
    const { dailyFoodItems } = await import('@/db/schema');
    const { eq } = await import('drizzle-orm');
    
    const item = await db.query.dailyFoodItems.findFirst({
      where: eq(dailyFoodItems.id, id)
    });
    
    if (item) {
      await DailyLogRepository.deleteFoodItem(id);
      await DailyLogRepository.recalculateTotals(item.dailyLogId);
    }
    
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    console.error('Delete food error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', errors: [] }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized', errors: [] }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: 'Invalid ID format', errors: [] }, { status: 400 });
    }

    const body = await request.json();
    if (!body.quantity || typeof body.quantity !== 'number' || body.quantity <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid quantity', errors: [] }, { status: 400 });
    }

    const { db } = await import('@/db');
    const { dailyFoodItems } = await import('@/db/schema');
    const { eq } = await import('drizzle-orm');
    
    const item = await db.query.dailyFoodItems.findFirst({
      where: eq(dailyFoodItems.id, id)
    });
    
    if (item) {
      await DailyLogRepository.updateFoodItem(id, body.quantity.toString());
      await DailyLogRepository.recalculateTotals(item.dailyLogId);
      return NextResponse.json({ success: true, message: 'Updated successfully' });
    }
    
    return NextResponse.json({ success: false, message: 'Item not found', errors: [] }, { status: 404 });
  } catch (error: any) {
    console.error('Update food error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', errors: [] }, { status: 500 });
  }
}
