-- DropForeignKey
ALTER TABLE "Coins" DROP CONSTRAINT "Coins_event_id_fkey";

-- AlterTable
ALTER TABLE "Coins" ALTER COLUMN "event_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Coins" ADD CONSTRAINT "Coins_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
