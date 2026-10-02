-- CreateEnum
CREATE TYPE "ToolCategory" AS ENUM ('IMAGE', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "ToolUsageStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "tools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "ToolCategory" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tool_usages" (
    "id" TEXT NOT NULL,
    "core_user_id" TEXT NOT NULL,
    "tool_id" TEXT NOT NULL,
    "status" "ToolUsageStatus" NOT NULL,
    "input_size_bytes" INTEGER,
    "output_size_bytes" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tool_usages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tools_category_idx" ON "tools"("category");

-- CreateIndex
CREATE INDEX "tool_usages_core_user_id_created_at_idx" ON "tool_usages"("core_user_id", "created_at");

-- CreateIndex
CREATE INDEX "tool_usages_tool_id_idx" ON "tool_usages"("tool_id");

-- AddForeignKey
ALTER TABLE "tool_usages" ADD CONSTRAINT "tool_usages_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
