-- CreateTable
CREATE TABLE "Media" (
    "media_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "publish_date" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "custom_parameters" JSONB NOT NULL,
    "images" JSONB[],
    "tracks" JSONB[],
    "assets" JSONB[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("media_id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "playlist_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "playlist" JSONB[],
    "description" TEXT,
    "custom_parameters" JSONB NOT NULL,
    "playlist_config" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("playlist_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_media_id_key" ON "Media"("media_id");

-- CreateIndex
CREATE INDEX media_custom_parameters_gin_idx ON "Media" USING gin(custom_parameters jsonb_path_ops);

-- CreateIndex
CREATE INDEX "media_images_gin_idx" ON "Media" USING gin(images jsonb_path_ops);

-- CreateIndex
CREATE INDEX "media_tracks_gin_idx" ON "Media" USING gin(tracks jsonb_path_ops);

-- CreateIndex
CREATE INDEX "media_assets_gin_idx" ON "Media" USING gin(assets jsonb_path_ops);

-- CreateIndex
CREATE INDEX "media_tags_gin_idx" ON "Media" USING gin(tags jsonb_path_ops);

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_playlist_id_key" ON "Playlist"("playlist_id");

-- CreateIndex
CREATE INDEX "playlist_gin_idx" ON "Playlist" USING gin(playlist jsonb_path_ops);

-- CreateIndex
CREATE INDEX "playlist_custom_parameters_gin_idx" ON "Playlist" USING gin(custom_parameters jsonb_path_ops);

-- CreateIndex
CREATE INDEX "playlist_config_gin_idx" ON "Playlist" USING gin(playlist_config jsonb_path_ops);