import { v4 as uuidv4 } from "uuid";

import { formatMedia } from "../utils/utils.media.js";
import * as repos from "../repos/repos.media.js";
import { formatPlaylist } from "../utils/utils.playlist.js";

export async function createPlaylist(playlistMetadata, dynamicPlaylistConfig) {
  const mediaItems = await repos.fetchDynamicMediaItems(dynamicPlaylistConfig);
  const convertedMediaItems = await Promise.all(
    mediaItems.map((mediaItem) => formatMedia(mediaItem))
  );

  const playlistId = uuidv4().substr(0, 6);
  const playlist = formatPlaylist({
    playlistId,
    playlist: convertedMediaItems,
    ...playlistMetadata,
  });

  return formatPlaylist(
    await repos.createPlaylist(playlist, dynamicPlaylistConfig)
  );
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
  return formatPlaylist(await repos.getPlaylistById(playlistId));
}
