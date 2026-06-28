import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export class UserRepository {
  static async getUserById(userId: string) {
    return db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  }

  static async updateUserGoals(userId: string, data: Partial<typeof users.$inferInsert>) {
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }
}
