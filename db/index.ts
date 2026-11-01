import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

export const db = drizzle({
  connection: process.env.DATABASE_URL!,
  relations: schema.foodRelations,
});

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
