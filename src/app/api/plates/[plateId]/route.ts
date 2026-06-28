import { NextResponse } from 'next/server';
import { PlateService } from '@/services/plate.service';
import { getSession } from '@/lib/auth';

export async function PATCH(request: Request, context: { params: Promise<{ plateId: string }> }) {
  try {
    const params = await context.params;
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const plateId = parseInt(params.plateId);
    if (isNaN(plateId)) return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });

    const body = await request.json();
    
    const updatedPlate = await PlateService.updatePlate(session.userId, plateId, {
      name: body.name,
      description: body.description,
      mealType: body.mealType,
      items: body.items || []
    });

    return NextResponse.json({ success: true, data: updatedPlate });
  } catch (error: any) {
    console.error('Update plate error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ plateId: string }> }) {
  try {
    const params = await context.params;
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const plateId = parseInt(params.plateId);
    if (isNaN(plateId)) return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });

    await PlateService.deletePlate(session.userId, plateId);

    return NextResponse.json({ success: true, message: 'Plate deleted' });
  } catch (error: any) {
    console.error('Delete plate error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
