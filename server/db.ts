import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/server/schema";

const sql = neon(
  "postgresql://neondb_owner:npg_IolHGrnQu9D0@ep-weathered-wildflower-a9004rxv-pooler.gwc.azure.neon.tech/terranovoa-ai-database?sslmode=require&channel_binding=require"
);

export const db = drizzle(sql, { schema, logger: true });
