import { NUTRIENTS } from "@/app/features/food/nutrients";
import { db } from "./index";
import { nutrient } from "./food-schema";

async function main() {
  await db
    .insert(nutrient)
    .values(Object.values(NUTRIENTS))
    .onConflictDoNothing({ target: nutrient.name });
  console.log(`Seeded ${Object.keys(NUTRIENTS).length} nutrients`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => process.exit());
