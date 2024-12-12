-- CreateTable
CREATE TABLE "Media" (
    "media_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "publish_date" TIMESTAMP(3),
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "custom_parameters" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Media_pkey" PRIMARY KEY ("media_id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "playlist_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "media_id" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "custom_parameters" JSONB NOT NULL DEFAULT '{}',
    "playlist_config" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("playlist_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_media_id_key" ON "Media"("media_id");

-- CreateIndex
CREATE INDEX "media_tags_idx" ON "Media"("tags");

-- CreateIndex
CREATE INDEX "idx_media_custom_parameters_gin" ON "Media" USING GIN ("custom_parameters");

-- CreateIndex
CREATE INDEX "idx_media_tags_gin" ON "Media" USING GIN ("tags");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_playlist_id_key" ON "Playlist"("playlist_id");

-- CreateIndex
CREATE INDEX "idx_playlist_custom_parameters_gin" ON "Playlist" USING GIN ("custom_parameters");

-- CreateIndex
CREATE INDEX "idx_media_id_gin" ON "Playlist" USING GIN ("media_id");
