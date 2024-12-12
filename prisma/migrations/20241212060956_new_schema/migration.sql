/*
  Warnings:

  - You are about to drop the column `playlist` on the `Playlist` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "media_tags_idx";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "searchable" tsvector;

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "playlist",
ADD COLUMN     "media_id" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "searchable_media_idx" ON "Media" USING GIN ("searchable");

-- CreateIndex
CREATE INDEX "playlist_media_id_idx_gin" ON "Playlist" USING GIN ("media_id");

-- CreateIndex
CREATE INDEX "playlist_config_idx" ON "Playlist" USING GIN ("playlist_config");

-- RenameIndex
ALTER INDEX "idx_playlist_custom_parameters_gin" RENAME TO "playlist_custom_parameters_idx";
