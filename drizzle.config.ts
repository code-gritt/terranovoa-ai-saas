import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

export default defineConfig({
  schema: "./server/schema.ts",
  out: "./server/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_IolHGrnQu9D0@ep-weathered-wildflower-a9004rxv-pooler.gwc.azure.neon.tech/terranovoa-ai-database?sslmode=require&channel_binding=require",
  },
});
