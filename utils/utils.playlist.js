export function formatPlaylist(rawPlaylist) {
  const { playlist_id, title, type, description, custom_parameters, playlist } =
    rawPlaylist;
  return {
    title,
    feedid: playlist_id,
    description,
    type,
    playlist,
    ...(custom_parameters || {}),
  };
}
