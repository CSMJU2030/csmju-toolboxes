CREATE TABLE "image_history" (
    "id" TEXT NOT NULL,
    "core_user_id" TEXT NOT NULL,
    "tool_id" TEXT NOT NULL,
    "original_filename" TEXT NOT NULL,
    "original_mime_type" TEXT NOT NULL,
    "original_size_bytes" INTEGER NOT NULL,
    "original_storage_key" TEXT NOT NULL,
    "output_filename" TEXT NOT NULL,
    "output_mime_type" TEXT NOT NULL,
    "output_size_bytes" INTEGER NOT NULL,
    "output_storage_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "image_history_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "image_history_original_storage_key_key" ON "image_history"("original_storage_key");
CREATE UNIQUE INDEX "image_history_output_storage_key_key" ON "image_history"("output_storage_key");
CREATE INDEX "image_history_core_user_id_created_at_idx" ON "image_history"("core_user_id", "created_at");
CREATE INDEX "image_history_expires_at_idx" ON "image_history"("expires_at");

ALTER TABLE "image_history" ADD CONSTRAINT "image_history_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
