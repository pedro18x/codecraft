ALTER TABLE "refresh_tokens"
ADD COLUMN "token_family" TEXT,
ADD COLUMN "token_version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "revoked_at" TIMESTAMP(3);

UPDATE "refresh_tokens"
SET "token_family" = md5("id"::text || clock_timestamp()::text)
WHERE "token_family" IS NULL;

ALTER TABLE "refresh_tokens"
ALTER COLUMN "token_family" SET NOT NULL;

CREATE INDEX "refresh_tokens_user_id_token_family_idx" ON "refresh_tokens" ("user_id", "token_family");
CREATE INDEX "refresh_tokens_revoked_at_idx" ON "refresh_tokens" ("revoked_at");
