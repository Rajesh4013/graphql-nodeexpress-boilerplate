import { prismaConnection as prisma } from "../connection.js";
import { logger } from "../logger/logger.js";

export async function createPlaylist(inputPlaylist, playlistConfig) {
  try {
    const {
      title,
      feedid,
      type,
      description,
      playlist,
      ...customParameters
    } = inputPlaylist;

    const playlistJson = playlist.map((playlistItem) => {
      return JSON.stringify(playlistItem);
    });

    const query = `
      INSERT INTO "Playlist" (
        "playlist_id",
        "title",
        "type",
        "description",
        "playlist",
        "custom_parameters",
        "playlist_config"
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5::jsonb[],
        $6::jsonb,
        $7::jsonb
      )
      RETURNING *;
    `;
    const playlistData = await prisma.$queryRawUnsafe(query, feedid, title, type, description, playlistJson, customParameters, playlistConfig);

    return playlistData[0];
  } catch (error) {
    logger.error(`Error creating playlist: ${error.message}`);
    throw new Error("Failed to create playlist. Please try again later.");
  }
}

export async function updatePlaylist(playlistId, updatedData) {
  try {
    const {
      title,
      kind,
      description,
      playlist,
      playlistConfig,
      ...customParameters
    } = updatedData;
    const playlistJson = playlist.map((playlistItem) => {
      return JSON.stringify(playlistItem);
    });
    const query = `
    UPDATE "Playlist"
    SET
      "title" = $1,
      "type" = $2,
      "description" = $3,
      "playlist" = $4::jsonb[],
      "custom_parameters" = $5::jsonb,
      "playlist_config" = $6::jsonb,
      "updated_at" = NOW()
    WHERE
      "playlist_id" = $7
    RETURNING "playlist_id", "title", "type", "description", "playlist", "custom_parameters";
  `;

    const updatedPlaylist = await prisma.$queryRawUnsafe(query, title, kind, description, playlistJson, customParameters, playlistConfig, playlistId);
    return updatedPlaylist[0];
  } catch (error) {
    logger.error(`Error updating playlist with ID ${playlistId}: ${error.message}`);
    throw new Error("Failed to update playlist. Please try again later.");
  }
}

export async function getPlaylistById(playlistId) {
  try {
    const playlist = await prisma.$queryRaw`SELECT * FROM "Playlist" p WHERE p."playlist_id" = ${playlistId};`;
    return playlist[0];
  } catch (error) {
    logger.error(error);
    return null;
  }
}
