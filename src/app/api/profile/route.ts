import { NextResponse } from 'next/server';
import { UserRepository } from '@/repositories/user.repository';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const updateProfileSchema = z.object({
  targetCalories: z.number().int().positive().optional(),
  proteinGoal: z.number().int().positive().optional(),
  fatGoal: z.number().int().positive().optional(),
  carbGoal: z.number().int().positive().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const user = await UserRepository.getUserById(session.userId);
    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const parseResult = updateProfileSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ success: false, message: 'Validation failed', errors: parseResult.error.flatten().fieldErrors }, { status: 400 });
    }

    const updatedUser = await UserRepository.updateUserGoals(session.userId, parseResult.data);
    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
