import { fetchDynamicMediaItems } from "../repos/repos.media.js";
import { updatePlaylist } from "../repos/repos.playlist.js"
export async function processJob(message) {
    const mediaItems = await fetchDynamicMediaItems(message.dynamicPlaylistConfig);
    await updatePlaylist(message.id, { playlist: mediaItems });
}
