-- CreateEnum
CREATE TYPE "SettingType" AS ENUM ('STRING', 'INTEGER', 'DECIMAL', 'BOOLEAN', 'JSON');

-- CreateEnum
CREATE TYPE "SettingCategory" AS ENUM ('APPEARANCE', 'SEO', 'ANALYTICS', 'CATALOG', 'COMMERCE', 'SYSTEM', 'GENERAL');

-- CreateTable
CREATE TABLE "site_setting" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(150) NOT NULL,
    "value" TEXT,
    "type" "SettingType" NOT NULL DEFAULT 'STRING',
    "category" "SettingCategory" NOT NULL DEFAULT 'GENERAL',
    "description" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "site_setting_key_key" ON "site_setting"("key");
