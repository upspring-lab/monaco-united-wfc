import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_sync_status_status" AS ENUM('ok', 'error', 'disabled');
  CREATE TABLE "sync_status" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"provider" varchar,
  	"last_run_at" timestamp(3) with time zone,
  	"status" "enum_sync_status_status",
  	"message" varchar,
  	"last_success_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL;
  ALTER TABLE "clubs" ADD COLUMN "external_id" varchar;
  ALTER TABLE "matches" ADD COLUMN "external_id" varchar;
  ALTER TABLE "matches" ADD COLUMN "locked_from_sync" boolean DEFAULT false;
  ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT '';
  ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "standings" ADD COLUMN "locked_from_sync" boolean DEFAULT false;
  CREATE UNIQUE INDEX "clubs_external_id_idx" ON "clubs" USING btree ("external_id");
  CREATE UNIQUE INDEX "matches_external_id_idx" ON "matches" USING btree ("external_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sync_status" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "sync_status" CASCADE;
  DROP INDEX "clubs_external_id_idx";
  DROP INDEX "matches_external_id_idx";
  ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;
  ALTER TABLE "clubs" DROP COLUMN "external_id";
  ALTER TABLE "matches" DROP COLUMN "external_id";
  ALTER TABLE "matches" DROP COLUMN "locked_from_sync";
  ALTER TABLE "media" DROP COLUMN "prefix";
  ALTER TABLE "media" DROP COLUMN "_objectkey";
  ALTER TABLE "standings" DROP COLUMN "locked_from_sync";
  DROP TYPE "public"."enum_sync_status_status";`)
}
