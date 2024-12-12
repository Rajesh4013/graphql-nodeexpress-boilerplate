import { v4 as uuidv4 } from 'uuid';

import * as repos from '../repos/repos.playlist.js';
import { fetchDynamicMediaItems } from '../repos/repos.media.js';
import { formatPlaylist } from '../utils/utils.playlist.js';

export async function createPlaylist(playlistMetadata, dynamicPlaylistConfig) {
  const mediaItems = await fetchDynamicMediaItems(dynamicPlaylistConfig);
  const convertedMediaIds = await Promise.all(
    mediaItems.map((mediaItem) => {
      return mediaItem.media_id;
    })
  );

  const playlistId = uuidv4();
  const createdPlaylist = await repos.createPlaylist(
    {
      playlistId,
      mediaIds: convertedMediaIds,
      ...playlistMetadata,
    },
    dynamicPlaylistConfig
  );
  return formatPlaylist(createdPlaylist);
}

export async function updatePlaylist(
  playlistId,
  playlistMetadata,
  dynamicPlaylistConfig
) {
  const mediaItems = await fetchDynamicMediaItems(dynamicPlaylistConfig);
  const convertedMediaIds = await Promise.all(
    mediaItems.map((mediaItem) => {
      return mediaItem.media_id;
    })
  );

  let updatedPlaylist = await repos.updatePlaylist(playlistId, {
    playlistConfig: dynamicPlaylistConfig,
    mediaIds: convertedMediaIds,
    ...playlistMetadata,
  });

  if (!updatedPlaylist) {
    return null;
  }
  return formatPlaylist(updatedPlaylist);
}

export async function getPlaylistById(playlistId) {
  const playlist = await repos.getPlaylistById(playlistId);
  if (!playlist) {
    return null;
  }
  playlist.playlist = playlist.playlist.map((mediaItem) => {
    let { custom_parameters: customParameters, ...media } = mediaItem;
    return { ...media, ...customParameters };
  })
  return formatPlaylist(playlist);
}
