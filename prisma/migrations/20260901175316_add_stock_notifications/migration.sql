-- CreateEnum
CREATE TYPE "StockNotificationStatus" AS ENUM ('PENDING', 'NOTIFIED', 'CANCELLED', 'FAILED');

-- CreateTable
CREATE TABLE "StockNotification" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "customerName" TEXT,
    "customerEmail" TEXT NOT NULL,
    "status" "StockNotificationStatus" NOT NULL DEFAULT 'PENDING',
    "notifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StockNotification_productId_idx" ON "StockNotification"("productId");

-- CreateIndex
CREATE INDEX "StockNotification_customerEmail_idx" ON "StockNotification"("customerEmail");

-- CreateIndex
CREATE INDEX "StockNotification_status_idx" ON "StockNotification"("status");

-- CreateIndex
CREATE UNIQUE INDEX "StockNotification_productId_customerEmail_key" ON "StockNotification"("productId", "customerEmail");
