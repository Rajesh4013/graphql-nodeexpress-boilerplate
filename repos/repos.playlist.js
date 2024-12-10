import { prismaConnection as prisma } from "../connection.js";

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
    const playlistData = await prisma.$queryRawUnsafe(query, feedid, title, type, description, playlist, customParameters, playlistConfig);

    return playlistData[0];
  } catch (error) {
    console.log(`Error creating playlist: ${error.message}`);
    throw new Error("Failed to create playlist. Please try again later.");
  }
}

export async function updatePlaylist(playlistId, updatedData) {
  try {
    const { title, type, description, playlist, playlistConfig, customParameters } = updatedData;

    let updateFields = [];
    let queryParams = [];
    let paramIndex = 1;

    const addField = (fieldName, value, castType = '') => {
      if (value) {
        updateFields.push(`"${fieldName}" = $${paramIndex++}${castType}`);
        queryParams.push(value);
      }
    };

    addField('title', title);
    addField('type', type);
    addField('description', description);
    addField('playlist', playlist, '::jsonb[]');
    addField('playlist_config', playlistConfig, '::jsonb');
    if (customParameters && Object.keys(customParameters).length) {
      addField('custom_parameters', customParameters, '::jsonb');
    }

    if (!updateFields.length) throw new Error("No fields to update");

    const updateQuery = `
      UPDATE "Playlist"
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE "playlist_id" = $${paramIndex}
      RETURNING "playlist_id", "title", "type", "description", "playlist", "custom_parameters";
    `;
    queryParams.push(playlistId);

    const updatedPlaylist = await prisma.$queryRawUnsafe(updateQuery, ...queryParams);
    return updatedPlaylist[0];
  } catch (error) {
    console.error(`Error updating playlist with ID ${playlistId}: ${error.message}`);
    throw new Error("Failed to update playlist. Please try again later.");
  }
}


export async function getPlaylistById(playlistId) {
  try {
    const playlist = await prisma.$queryRaw`SELECT * FROM "Playlist" p WHERE p."playlist_id" = ${playlistId};`;
    return playlist[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}
