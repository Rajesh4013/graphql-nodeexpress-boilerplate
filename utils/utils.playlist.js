export function formatPlaylist(rawPlaylist) {
  const { playlist_id, title, type, description, custom_parameters, media_id } =
    rawPlaylist;
  return {
    title,
    feedid: playlist_id,
    description,
    type,
    media_id,
    ...(custom_parameters || {}),
  };
}
