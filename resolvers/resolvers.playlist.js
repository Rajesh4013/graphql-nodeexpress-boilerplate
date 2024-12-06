import { v4 as uuidv4 } from "uuid";

import { formatMedia } from "../utils/utils.media.js";
import * as repos from "../repos/repos.playlist.js";
import { fetchDynamicMediaItems } from "../repos/repos.media.js";
import { formatPlaylist } from "../utils/utils.playlist.js";

export async function createPlaylist(playlistMetadata, dynamicPlaylistConfig) {
  const mediaItems = await fetchDynamicMediaItems(dynamicPlaylistConfig);
  console.log(mediaItems.length);
  const convertedMediaItems = await Promise.all(
    mediaItems.map((mediaItem) => formatMedia(mediaItem))
  );

  const playlist_id = uuidv4().substr(0, 6);
  const playlist = formatPlaylist({
    playlist_id,
    playlist: convertedMediaItems,
    ...playlistMetadata,
  });

  const createdPlaylist = await repos.createPlaylist(playlist, dynamicPlaylistConfig);
  return formatPlaylist(createdPlaylist);
}

export async function updatePlaylist(
  playlistId,
  playlistMetadata,
  dynamicPlaylistConfig
) {
  const mediaItems = await fetchDynamicMediaItems(dynamicPlaylistConfig);
  const convertedMediaItems = await Promise.all(
    mediaItems.map((mediaItem) => formatMedia(mediaItem))
  );

  const updatedPlaylist = formatPlaylist({
    playlistId,
    playlist: convertedMediaItems,
    ...playlistMetadata,
  });

  return formatPlaylist(
    await repos.updatePlaylist(playlistId, updatedPlaylist)
  );
}

export async function getPlaylistById(playlistId) {
  const playlist = await repos.getPlaylistById(playlistId)
  return formatPlaylist(playlist);
}
