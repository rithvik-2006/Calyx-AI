import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { hashPassword, setSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const [newUser] = await db.insert(users).values({
      email: email.toLowerCase(),
      passwordHash,
      name,
    }).returning();

    await setSession(newUser.id);

    return NextResponse.json({ success: true, user: { id: newUser.id, email: newUser.email, name: newUser.name } });
  } catch (error: any) {
    console.error('Register error:', error);
    if (error.code === '23505') { // unique_violation
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
