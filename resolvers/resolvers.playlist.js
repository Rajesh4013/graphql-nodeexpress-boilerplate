import { v4 as uuidv4 } from "uuid";

import * as repos from "../repos/repos.playlist.js";
import { fetchDynamicMediaItems } from "../repos/repos.media.js";
import { formatPlaylist } from "../utils/utils.playlist.js";

export async function createPlaylist(playlistMetadata, dynamicPlaylistConfig) {
  const mediaItems = await fetchDynamicMediaItems(dynamicPlaylistConfig);
  const convertedMediaItems = await Promise.all(
    mediaItems.map((mediaItem) => {
      let { custom_parameters, ...media } = mediaItem;
      return { ...media, ...custom_parameters };
    })
  );

  const playlist_id = uuidv4();
  const playlist = formatPlaylist({
    playlist_id,
    playlist: convertedMediaItems,
    custom_parameters: playlistMetadata.customParameters,
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
    mediaItems.map((mediaItem) => {
      let { custom_parameters, ...media } = mediaItem;
      const updatedMediaItem = { ...media, ...custom_parameters };
      return updatedMediaItem;
    })
  );

  const updatedPlaylist = formatPlaylist({
    playlistId,
    playlist: convertedMediaItems,
    custom_parameters: playlistMetadata.customParameters,
    ...playlistMetadata,
  });

  return formatPlaylist(
    await repos.updatePlaylist(playlistId, { playlistConfig: dynamicPlaylistConfig, ...updatedPlaylist })
  );
}

export async function getPlaylistById(playlistId) {
  const playlist = await repos.getPlaylistById(playlistId)
  return formatPlaylist(playlist);
}
