import { v4 as uuidv4 } from "uuid";

import * as repos from "../repos/repos.playlist.js";
import { formatPlaylist } from "../utils/utils.playlist.js";
import { bullMQTask } from "../app.js"

export async function createPlaylist(playlistMetadata, dynamicPlaylistConfig) {
  const playlistId = uuidv4();
  const createdPlaylist = await repos.createPlaylist({ playlistId, ...playlistMetadata }, dynamicPlaylistConfig);
  bullMQTask.postMessage({ id: createdPlaylist.playlist_id, dynamicPlaylistConfig });
  return createdPlaylist;
}

export async function updatePlaylist(
  playlistId,
  playlistMetadata,
  dynamicPlaylistConfig
) {
  bullMQTask.postMessage({ id: playlistId, dynamicPlaylistConfig });
  const { customParameters, ...destructuredMetadata } = playlistMetadata;
  const updatedPlaylist = await repos.updatePlaylist(playlistId, {
    playlistConfig: dynamicPlaylistConfig,
    customParameters,
    ...destructuredMetadata,
  })
  if (!updatedPlaylist) {
    return null;
  }
  return formatPlaylist(updatedPlaylist);
}

export async function getPlaylistById(playlistId) {
  const playlist = await repos.getPlaylistById(playlistId)
  if (!playlist) {
    return null;
  }
  return formatPlaylist(playlist);
}
