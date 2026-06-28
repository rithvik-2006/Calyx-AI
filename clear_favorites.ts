import { db } from './src/db/index';
import { favoriteFoods } from './src/db/schema';

async function main() {
  console.log('Truncating favorite_foods table...');
  await db.delete(favoriteFoods);
  console.log('Done.');
  process.exit(0);
}

main().catch(console.error);
