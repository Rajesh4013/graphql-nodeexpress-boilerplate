import { prismaConnection as prisma } from "../connection.js";

export async function createPlaylist(inputPlaylist, playlist_config) {
  try {
    const { title, feedid, type, description, playlist, ...customParameters } =
      inputPlaylist;
    const playlistData = await prisma.playlist.create({
      data: {
        playlist_id: feedid,
        title,
        type,
        description,
        playlist: playlist,
        custom_parameters: customParameters,
        playlist_config,
      },
    });
    return playlistData;
  } catch (error) {
    console.log(`Error creating playlist: ${error.message}`);
    throw new Error("Failed to create playlist. Please try again later.");
  }
}

export async function updatePlaylist(playlistId, updatedData) {
  try {
    const { title, kind, description, playlist, ...customParameters } =
      updatedData;
    const updatedPlaylist = await prisma.playlist.update({
      where: { playlistId },
      data: {
        title,
        type: kind,
        description,
        playlist,
        customParameters,
      },
    });
    return updatedPlaylist;
  } catch (error) {
    console.log(
      `Error updating playlist with ID ${playlistId}: ${error.message}`
    );
    throw new Error("Failed to update playlist. Please try again later.");
  }
}

export async function getPlaylistById(playlistId) {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: {
        playlist_id: playlistId,
      },
    });
    return playlist;
  } catch (error) {
    console.log(error);
    return null;
  }
}
