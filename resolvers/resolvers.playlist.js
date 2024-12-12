import { v4 as uuidv4 } from 'uuid';

import * as repos from '../repos/repos.playlist.js';
import { fetchDynamicMediaIds } from '../repos/repos.media.js';
import { formatPlaylist } from '../utils/utils.playlist.js';

export async function createPlaylist(playlistMetadata, dynamicPlaylistConfig) {
  const media_id = await fetchDynamicMediaIds(dynamicPlaylistConfig);
  const playlist_id = uuidv4();
  const playlist = formatPlaylist({
    playlist_id,
    media_id,
    custom_parameters: playlistMetadata.customParameters,
    ...playlistMetadata,
  });

  const createdPlaylist = await repos.createPlaylist(
    playlist,
    dynamicPlaylistConfig
  );
  return formatPlaylist(createdPlaylist);
}

export async function updatePlaylist(
  playlistId,
  playlistMetadata,
  dynamicPlaylistConfig
) {
  const media_id = await fetchDynamicMediaIds(dynamicPlaylistConfig);
  let updatedPlaylist = formatPlaylist({
    playlistId,
    media_id,
    custom_parameters: playlistMetadata.customParameters,
    ...playlistMetadata,
  });

  updatedPlaylist = await repos.updatePlaylist(playlistId, {
    playlistConfig: dynamicPlaylistConfig,
    ...updatedPlaylist,
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
  return formatPlaylist(playlist);
}
