import { NextResponse } from 'next/server';
import { PlateService } from '@/services/plate.service';
import { getSession } from '@/lib/auth';

export async function POST(request: Request, context: { params: Promise<{ plateId: string }> }) {
  try {
    const params = await context.params;
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const plateId = parseInt(params.plateId);
    if (isNaN(plateId)) return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });

    const newPlate = await PlateService.duplicatePlate(session.userId, plateId);

    return NextResponse.json({ success: true, data: newPlate });
  } catch (error: any) {
    console.error('Duplicate plate error:', error);
    if (error.message === 'Plate not found') {
      return NextResponse.json({ success: false, message: 'Plate not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
