import { NextResponse } from 'next/server';
import { PlateService } from '@/services/plate.service';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const plates = await PlateService.getGroupedPlates(session.userId);
    return NextResponse.json({ success: true, data: plates });
  } catch (error: any) {
    console.error('Get plates error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, message: 'Plate name is required' }, { status: 400 });
    }

    const newPlate = await PlateService.createPlate(session.userId, {
      name: body.name,
      description: body.description,
      mealType: body.mealType,
      items: body.items || []
    });

    return NextResponse.json({ success: true, data: newPlate });
  } catch (error: any) {
    console.error('Create plate error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
