import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  integer, 
  decimal,
  boolean,
  date,
  uuid,
  unique
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  height: decimal('height'),
  weight: decimal('weight'),
  age: integer('age'),
  gender: text('gender'),
  goal: text('goal'),
  activityLevel: text('activity_level'),
  targetCalories: integer('target_calories'),
  proteinGoal: integer('protein_goal'),
  fatGoal: integer('fat_goal'),
  carbGoal: integer('carb_goal'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const foodMaster = pgTable('food_master', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  calories: integer('calories').notNull(),
  protein: decimal('protein').notNull(),
  fat: decimal('fat').notNull(),
  carbs: decimal('carbs').notNull(),
  servingSize: text('serving_size').notNull(),
  category: text('category'),
});

export const customFoods = pgTable('custom_foods', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  calories: integer('calories').notNull(),
  protein: decimal('protein').notNull(),
  fat: decimal('fat').notNull(),
  carbs: decimal('carbs').notNull(),
  servingSize: text('serving_size').notNull(),
});

export const favoriteFoods = pgTable('favorite_foods', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  foodMasterId: integer('food_master_id').references(() => foodMaster.id),
  customFoodId: integer('custom_food_id').references(() => customFoods.id),
  isPinned: boolean('is_pinned').default(false).notNull(),
  pinOrder: integer('pin_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  unqMaster: unique('unq_user_master').on(t.userId, t.foodMasterId),
  unqCustom: unique('unq_user_custom').on(t.userId, t.customFoodId)
}));

export const dailyLogs = pgTable('daily_logs', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  date: date('date').notNull(), // 'YYYY-MM-DD'
  totalCalories: integer('total_calories').default(0),
  totalProtein: decimal('total_protein').default('0'),
  totalFat: decimal('total_fat').default('0'),
  totalCarbs: decimal('total_carbs').default('0'),
});

export const dailyFoodItems = pgTable('daily_food_items', {
  id: serial('id').primaryKey(),
  dailyLogId: integer('daily_log_id').references(() => dailyLogs.id).notNull(),
  mealType: text('meal_type').notNull(), // Breakfast, Lunch, Snack, Dinner
  foodMasterId: integer('food_master_id').references(() => foodMaster.id),
  customFoodId: integer('custom_food_id').references(() => customFoods.id),
  quantity: decimal('quantity').notNull().default('1'),
  loggedAt: timestamp('logged_at').defaultNow().notNull(),
});

export const weightLogs = pgTable('weight_logs', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  weight: decimal('weight').notNull(),
  date: date('date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const aiFoodLogs = pgTable('ai_food_logs', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  rawInput: text('raw_input').notNull(),
  parsedResult: text('parsed_result'), // JSON string of the parsed items
  confidence: integer('confidence'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const plates = pgTable('plates', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  mealType: text('meal_type'), // Breakfast, Lunch, Snack, Dinner
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const plateItems = pgTable('plate_items', {
  id: serial('id').primaryKey(),
  plateId: integer('plate_id').references(() => plates.id, { onDelete: 'cascade' }).notNull(),
  foodMasterId: integer('food_master_id').references(() => foodMaster.id),
  customFoodId: integer('custom_food_id').references(() => customFoods.id),
  quantity: decimal('quantity').notNull().default('1'),
});
