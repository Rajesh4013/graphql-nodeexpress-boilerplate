export function formatPlaylist(rawPlaylist) {
  const { playlistId, title, type, description, customParameters, playlist } =
    rawPlaylist;
  return {
    title,
    feedid: playlistId,
    description,
    type,
    playlist,
    ...(customParameters || {}),
  };
}
